const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Schedule = require("../models/Schedule");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { scheduleId, seatNumbers, bookingType, totalPrice } = req.body;

    if (!scheduleId || !seatNumbers || !bookingType || totalPrice === undefined) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "All required fields must be provided" });
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

    const schedule = await Schedule.findById(scheduleId).session(session);
    if (!schedule) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Check if any of the requested seats are already booked
    const alreadyBooked = seatNumbers.some((seat) => schedule.bookedSeats.includes(seat));
    if (alreadyBooked) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "One or more selected seats are already booked" });
    }

    // Create the booking
    const booking = await Booking.create(
      [
        {
          userId: req.user._id,
          scheduleId,
          seatNumbers,
          bookingType,
          totalPrice,
          status: "Confirmed",
        },
      ],
      { session }
    );

    // Update the schedule's bookedSeats
    schedule.bookedSeats.push(...seatNumbers);
    await schedule.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Booking created successfully",
      booking: booking[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: "scheduleId",
        populate: [
          { path: "routeId", select: "routeName startLocation endLocation" },
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
          { path: "routeId", select: "routeName startLocation endLocation" },
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

    booking.status = "Cancelled";
    await booking.save({ session });

    const schedule = await Schedule.findById(booking.scheduleId).session(session);
    if (schedule) {
      // Remove seats from schedule
      schedule.bookedSeats = schedule.bookedSeats.filter(
        (seat) => !booking.seatNumbers.includes(seat)
      );
      await schedule.save({ session });
    }

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
