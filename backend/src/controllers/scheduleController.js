const mongoose = require("mongoose");
const Schedule = require("../models/Schedule");
const Route = require("../models/Route");
const Bus = require("../models/Bus");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

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

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
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
    const schedules = await Schedule.find()
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

    const schedule = await Schedule.findById(id)
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

    if (routeId) {
      if (!isValidObjectId(routeId)) return res.status(400).json({ message: "Invalid route ID" });
      const route = await Route.findById(routeId);
      if (!route) return res.status(404).json({ message: "Route not found" });
      schedule.routeId = routeId;
    }

    if (busId) {
      if (!isValidObjectId(busId)) return res.status(400).json({ message: "Invalid bus ID" });
      const bus = await Bus.findById(busId);
      if (!bus) return res.status(404).json({ message: "Bus not found" });
      schedule.busId = busId;
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

    await Schedule.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
