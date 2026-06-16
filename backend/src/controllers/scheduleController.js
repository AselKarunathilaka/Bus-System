const mongoose = require("mongoose");
const Schedule = require("../models/Schedule");
const Route = require("../models/Route");
const Bus = require("../models/Bus");
const Booking = require("../models/Booking");
const { buildJourneyWindow, windowsOverlap } = require("../utils/dateTime");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const VALID_STATUSES = new Set(["Scheduled", "Completed", "Cancelled"]);

const findBusConflict = async ({
  busId,
  departureDate,
  departureTime,
  arrivalTime,
  excludeScheduleId,
}) => {
  const requestedWindow = buildJourneyWindow(
    departureDate,
    departureTime,
    arrivalTime
  );
  if (!requestedWindow) return { invalidTime: true };

  const rangeStart = new Date(requestedWindow.start);
  rangeStart.setDate(rangeStart.getDate() - 1);
  const rangeEnd = new Date(requestedWindow.end);
  rangeEnd.setDate(rangeEnd.getDate() + 1);

  const query = {
    busId,
    status: "Scheduled",
    departureDate: { $gte: rangeStart, $lte: rangeEnd },
  };
  if (excludeScheduleId) query._id = { $ne: excludeScheduleId };

  const schedules = await Schedule.find(query).lean();
  const conflict = schedules.find((schedule) => {
    const existingWindow = buildJourneyWindow(
      schedule.departureDate,
      schedule.departureTime,
      schedule.arrivalTime
    );
    return existingWindow && windowsOverlap(requestedWindow, existingWindow);
  });

  return { requestedWindow, conflict };
};

exports.createSchedule = async (req, res) => {
  try {
    const { routeId, busId, departureDate, departureTime, arrivalTime, status } = req.body;

    if (!routeId || !busId || !departureDate || !departureTime || !arrivalTime) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (!isValidObjectId(routeId) || !isValidObjectId(busId)) {
      return res.status(400).json({ message: "Invalid route or bus ID" });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    if (route.status !== "active") {
      return res.status(400).json({ message: "Only active routes can be scheduled" });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    if (bus.status !== "Available") {
      return res.status(400).json({ message: "Only available buses can be scheduled" });
    }
    if (bus.assignedRoute && bus.assignedRoute.toString() !== routeId) {
      return res.status(400).json({ message: "This bus is assigned to a different route" });
    }

    if (status && !VALID_STATUSES.has(status)) {
      return res.status(400).json({ message: "Invalid schedule status" });
    }
    if (status && status !== "Scheduled") {
      return res.status(400).json({ message: "New schedules must start with Scheduled status" });
    }

    const { requestedWindow, conflict, invalidTime } = await findBusConflict({
      busId,
      departureDate,
      departureTime,
      arrivalTime,
    });

    if (invalidTime) {
      return res.status(400).json({ message: "Use a valid departure and arrival time" });
    }

    if (requestedWindow.start <= new Date()) {
      return res.status(400).json({ message: "Departure must be in the future" });
    }

    if (conflict) {
      return res.status(409).json({ message: "This bus already has an overlapping schedule" });
    }

    const schedule = await Schedule.create({
      routeId,
      busId,
      departureDate,
      departureTime,
      arrivalTime,
      status: status || "Scheduled",
      bookedSeats: [],
    });

    return res.status(201).json({
      message: "Schedule created successfully",
      schedule,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find(
      req.user.role === "admin" ? {} : { status: "Scheduled" }
    )
      .populate("routeId", "routeName startLocation endLocation price distanceKm")
      .populate("busId", "busName licenseNumber seatCount busType")
      .sort({ departureDate: 1, departureTime: 1 });

    return res.status(200).json(schedules);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid schedule ID" });
    }

    const scheduleFilter =
      req.user.role === "admin"
        ? { _id: id }
        : { _id: id, status: "Scheduled" };
    const schedule = await Schedule.findOne(scheduleFilter)
      .populate("routeId")
      .populate("busId");

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    return res.status(200).json(schedule);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { routeId, busId, departureDate, departureTime, arrivalTime, status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid schedule ID" });
    }

    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    if (status && !VALID_STATUSES.has(status)) {
      return res.status(400).json({ message: "Invalid schedule status" });
    }

    const hasActiveBookings = schedule.bookedSeats.length > 0;
    const hasBookingHistory =
      hasActiveBookings || Boolean(await Booking.exists({ scheduleId: id }));
    const operationalDetailsChanged =
      (routeId && routeId !== schedule.routeId.toString()) ||
      (busId && busId !== schedule.busId.toString()) ||
      (departureDate &&
        new Date(departureDate).getTime() !== new Date(schedule.departureDate).getTime()) ||
      (departureTime && departureTime !== schedule.departureTime) ||
      (arrivalTime && arrivalTime !== schedule.arrivalTime);

    if (hasBookingHistory && operationalDetailsChanged) {
      return res.status(409).json({
        message: "Trip details cannot be changed after a booking has been recorded",
      });
    }

    if (hasActiveBookings && status === "Cancelled") {
      return res.status(409).json({
        message: "Cancel the schedule's bookings before cancelling the schedule",
      });
    }

    if (routeId && !isValidObjectId(routeId)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }
    if (busId && !isValidObjectId(busId)) {
      return res.status(400).json({ message: "Invalid bus ID" });
    }

    const effectiveRoute = await Route.findById(routeId || schedule.routeId);
    const effectiveBus = await Bus.findById(busId || schedule.busId);

    if (routeId) {
      if (!effectiveRoute) return res.status(404).json({ message: "Route not found" });
      schedule.routeId = routeId;
    }

    if (busId) {
      if (!effectiveBus) return res.status(404).json({ message: "Bus not found" });
      schedule.busId = busId;
    }

    if (!effectiveRoute || !effectiveBus) {
      return res.status(404).json({ message: "Assigned route or bus no longer exists" });
    }

    const effectiveStatus = status || schedule.status;
    if (effectiveStatus === "Scheduled") {
      if (effectiveRoute.status !== "active") {
        return res.status(400).json({ message: "Only active routes can be scheduled" });
      }
      if (effectiveBus.status !== "Available") {
        return res.status(400).json({ message: "Only available buses can be scheduled" });
      }
      if (
        effectiveBus.assignedRoute &&
        effectiveBus.assignedRoute.toString() !== effectiveRoute._id.toString()
      ) {
        return res.status(400).json({ message: "This bus is assigned to a different route" });
      }
    }

    const effectiveDepartureDate = departureDate || schedule.departureDate;
    const effectiveDepartureTime = departureTime || schedule.departureTime;
    const effectiveArrivalTime = arrivalTime || schedule.arrivalTime;

    if (effectiveStatus === "Scheduled") {
      const { requestedWindow, conflict, invalidTime } = await findBusConflict({
        busId: effectiveBus._id,
        departureDate: effectiveDepartureDate,
        departureTime: effectiveDepartureTime,
        arrivalTime: effectiveArrivalTime,
        excludeScheduleId: schedule._id,
      });

      if (invalidTime) {
        return res.status(400).json({ message: "Use a valid departure and arrival time" });
      }
      if (requestedWindow.start <= new Date()) {
        return res.status(400).json({ message: "Departure must be in the future" });
      }
      if (conflict) {
        return res.status(409).json({ message: "This bus already has an overlapping schedule" });
      }
    } else if (effectiveStatus === "Completed") {
      const journeyWindow = buildJourneyWindow(
        effectiveDepartureDate,
        effectiveDepartureTime,
        effectiveArrivalTime
      );
      if (!journeyWindow || journeyWindow.end > new Date()) {
        return res.status(400).json({
          message: "A schedule can only be completed after its arrival time",
        });
      }
    }

    schedule.departureDate = departureDate || schedule.departureDate;
    schedule.departureTime = departureTime || schedule.departureTime;
    schedule.arrivalTime = arrivalTime || schedule.arrivalTime;
    schedule.status = status || schedule.status;

    await schedule.save();

    return res.status(200).json({
      message: "Schedule updated successfully",
      schedule,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid schedule ID" });
    }

    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    const bookingCount = await Booking.countDocuments({ scheduleId: id });
    if (bookingCount > 0) {
      return res.status(409).json({
        message: "Schedules with booking history cannot be deleted. Mark the schedule completed or cancelled instead.",
      });
    }

    await Schedule.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
