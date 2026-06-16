const mongoose = require("mongoose");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Schedule = require("../models/Schedule");
const Route = require("../models/Route");
const Bus = require("../models/Bus");
const { buildJourneyWindow } = require("../utils/dateTime");
const { cleanText, isValidPhone } = require("../utils/validation");
const { releaseExpiredBookings } = require("../utils/releaseExpiredBookings");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createBooking = async (req, res) => {
  // First release expired bookings to free up seats
  await releaseExpiredBookings();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { scheduleId, seatNumbers, bookingType } = req.body;
    const contactNumber = cleanText(req.body.contactNumber, 20);
    const passengerName = cleanText(req.body.passengerName, 100);
    const passengerPhone = cleanText(req.body.passengerPhone, 20);
    const adminNote = cleanText(req.body.adminNote, 500);

    if (!scheduleId || !seatNumbers || !bookingType) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Schedule ID, seat numbers, and booking type are required" });
    }

    if (!isValidObjectId(scheduleId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid schedule ID" });
    }

    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Seat numbers must be a non-empty array" });
    }

    if (!["Single", "Family"].includes(bookingType)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid booking type" });
    }

    if (!seatNumbers.every((seat) => Number.isInteger(seat))) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Seat numbers must be whole numbers" });
    }

    // Check for duplicate seats in request
    const uniqueSeats = [...new Set(seatNumbers)];
    if (uniqueSeats.length !== seatNumbers.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Duplicate seats in request" });
    }

    if (bookingType === "Single" && seatNumbers.length !== 1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Single booking can only have 1 seat" });
    }

    if (bookingType === "Family" && (seatNumbers.length < 1 || seatNumbers.length > 8)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Family booking must have between 1 and 8 seats" });
    }

    if (req.user.role !== "admin") {
      if (!passengerName) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Passenger name is required" });
      }

      if (!isValidPhone(passengerPhone || contactNumber)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "A valid passenger phone number is required" });
      }
    } else if ((passengerPhone || contactNumber) && !isValidPhone(passengerPhone || contactNumber)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Passenger phone number is invalid" });
    }

    const schedule = await Schedule.findById(scheduleId).session(session);
    if (!schedule) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Schedule not found" });
    }

    if (schedule.status !== "Scheduled") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "This schedule is no longer active for booking" });
    }

    const journeyWindow = buildJourneyWindow(
      schedule.departureDate,
      schedule.departureTime,
      schedule.arrivalTime
    );
    if (!journeyWindow || journeyWindow.start <= new Date()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "This schedule has already departed" });
    }

    const bus = await Bus.findById(schedule.busId).session(session);
    if (!bus) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Assigned bus not found" });
    }

    if (bus.status !== "Available") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "The assigned bus is not available" });
    }

    const invalidSeats = seatNumbers.filter(seat => seat < 1 || seat > bus.seatCount);
    if (invalidSeats.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: `Seats out of bounds. Bus has ${bus.seatCount} seats.` });
    }

    const route = await Route.findById(schedule.routeId).session(session);
    if (!route) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Route not found" });
    }

    if (route.status !== "active") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "This route is currently inactive" });
    }

    const reservedSchedule = await Schedule.findOneAndUpdate(
      {
        _id: scheduleId,
        status: "Scheduled",
        bookedSeats: { $nin: seatNumbers },
      },
      { $addToSet: { bookedSeats: { $each: seatNumbers } } },
      { new: true, session }
    );

    if (!reservedSchedule) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "One or more selected seats are already booked" });
    }

    // Server-side price calculation
    const calculatedPrice = route.price * seatNumbers.length;

    const bookingId = `BKG-${Date.now().toString(36).toUpperCase()}-${crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;

    // Calculate expiration time (10 minutes from now) for normal users
    const paymentHoldMinutes = parseInt(process.env.PAYMENT_HOLD_MINUTES || "10", 10);
    const paymentExpiresAt = new Date(Date.now() + paymentHoldMinutes * 60 * 1000);

    const isAdminBooking = req.user.role === "admin";

    // Create the booking
    const booking = await Booking.create(
      [
        {
          bookingId,
          userId: req.user._id,
          scheduleId,
          seatNumbers,
          bookingType,
          totalPrice: calculatedPrice,
          contactNumber,
          passengerName,
          passengerPhone,
          createdByRole: req.user.role,
          createdBy: req.user._id,
          isManualBooking: isAdminBooking,
          adminNote: isAdminBooking ? adminNote : undefined,
          status: isAdminBooking ? "Confirmed" : "PendingPayment",
          paymentStatus: isAdminBooking ? "NotRequired" : "Pending",
          paymentProvider: isAdminBooking ? "manual" : "mock",
          paymentExpiresAt: isAdminBooking ? undefined : paymentExpiresAt,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Booking created successfully",
      booking: booking[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error?.errorLabels?.includes("TransientTransactionError")) {
      return res.status(409).json({
        message: "Seat availability changed while booking. Please select seats again.",
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: "scheduleId",
        populate: [
          { path: "routeId", select: "routeName startLocation endLocation distanceKm price" },
          { path: "busId", select: "busName licenseNumber" },
        ],
      })
      .sort({ bookingDate: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "fullName email phone")
      .populate({
        path: "scheduleId",
        populate: [
          { path: "routeId", select: "routeName startLocation endLocation distanceKm price" },
          { path: "busId", select: "busName licenseNumber" },
        ],
      })
      .sort({ bookingDate: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id).session(session);

    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Booking not found" });
    }

    // If user is not admin, they can only cancel their own booking
    if (req.user.role !== "admin" && booking.userId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "Access denied" });
    }

    if (booking.status === "Cancelled") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    const schedule = await Schedule.findById(booking.scheduleId).session(session);
    if (req.user.role !== "admin" && schedule) {
      const journeyWindow = buildJourneyWindow(
        schedule.departureDate,
        schedule.departureTime,
        schedule.arrivalTime
      );
      if (!journeyWindow || journeyWindow.start <= new Date()) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: "Bookings cannot be cancelled after the trip has departed",
        });
      }
    }

    booking.status = "Cancelled";
    await booking.save({ session });

    await Schedule.updateOne(
      { _id: booking.scheduleId },
      { $pullAll: { bookedSeats: booking.seatNumbers } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id).session(session);

    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Booking not found" });
    }

    // Free up seats if it wasn't cancelled already
    if (booking.status !== "Cancelled") {
      await Schedule.updateOne(
        { _id: booking.scheduleId },
        { $pullAll: { bookedSeats: booking.seatNumbers } },
        { session }
      );
    }

    await Booking.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: error.message });
  }
};
