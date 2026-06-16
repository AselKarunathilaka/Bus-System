const mongoose = require("mongoose");
const Bus = require("../models/Bus");
const Route = require("../models/Route");
const Schedule = require("../models/Schedule");
const Booking = require("../models/Booking");
const { isPositiveNumber } = require("../utils/validation");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const routePopulateFields =
  "routeName startLocation endLocation price distanceKm estimatedDuration status";
const passengerBusFields =
  "busName licenseNumber seatCount busType assignedRoute status";
const VALID_BUS_TYPES = new Set([
  "Normal",
  "Semi Luxury",
  "Luxury",
  "Super Luxury",
]);
const VALID_BUS_STATUSES = new Set(["Available", "Maintenance", "Inactive"]);

const applyBusVisibility = (query, user) =>
  user?.role === "admin" ? query : query.select(passengerBusFields);

const validateRequiredFields = (body) => {
  const requiredFields = [
    "busName",
    "licenseNumber",
    "driverName",
    "driverNIC",
    "conductorName",
    "conductorNIC",
    "busContactNumber",
    "seatCount",
    "busType",
  ];

  for (const field of requiredFields) {
    if (
      body[field] === undefined ||
      body[field] === null ||
      String(body[field]).trim() === ""
    ) {
      return `${field} is required`;
    }
  }

  return null;
};

exports.createBus = async (req, res) => {
  try {
    const validationError = validateRequiredFields(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const {
      busName,
      licenseNumber,
      driverName,
      driverNIC,
      conductorName,
      conductorNIC,
      busContactNumber,
      seatCount,
      busType,
      assignedRoute,
      status,
    } = req.body;

    if (
      !isPositiveNumber(seatCount) ||
      !Number.isInteger(Number(seatCount)) ||
      Number(seatCount) > 100
    ) {
      return res.status(400).json({
        message: "Seat count must be between 1 and 100",
      });
    }
    if (!VALID_BUS_TYPES.has(busType)) {
      return res.status(400).json({ message: "Invalid bus type" });
    }
    if (status && !VALID_BUS_STATUSES.has(status)) {
      return res.status(400).json({ message: "Invalid bus status" });
    }

    if (assignedRoute) {
      if (!isValidObjectId(assignedRoute)) {
        return res.status(400).json({ message: "Invalid route ID" });
      }

      const routeExists = await Route.findById(assignedRoute);

      if (!routeExists) {
        return res.status(404).json({ message: "Assigned route not found" });
      }
    }

    const existingBus = await Bus.findOne({
      licenseNumber: licenseNumber.trim().toUpperCase(),
    });

    if (existingBus) {
      return res.status(400).json({
        message: "Bus license number already exists",
      });
    }

    const bus = await Bus.create({
      busName: busName.trim(),
      licenseNumber: licenseNumber.trim().toUpperCase(),
      driverName: driverName.trim(),
      driverNIC: driverNIC.trim(),
      conductorName: conductorName.trim(),
      conductorNIC: conductorNIC.trim(),
      busContactNumber: busContactNumber.trim(),
      seatCount: Number(seatCount),
      busType,
      assignedRoute: assignedRoute || null,
      status: status || "Available",
      createdBy: req.user?._id,
    });

    const populatedBus = await Bus.findById(bus._id)
      .populate("assignedRoute", routePopulateFields)
      .populate("createdBy", "fullName email role");

    return res.status(201).json({
      message: "Bus created successfully",
      bus: populatedBus,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllBuses = async (req, res) => {
  try {
    const query = applyBusVisibility(
      Bus.find(req.user.role === "admin" ? {} : { status: "Available" }),
      req.user
    )
      .populate("assignedRoute", routePopulateFields)
      .sort({ createdAt: -1 });

    if (req.user.role === "admin") {
      query.populate("createdBy", "fullName email role");
    }

    const buses = await query;

    return res.status(200).json(buses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getBusById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid bus ID" });
    }

    const busFilter =
      req.user.role === "admin"
        ? { _id: id }
        : { _id: id, status: "Available" };
    const query = applyBusVisibility(Bus.findOne(busFilter), req.user)
      .populate("assignedRoute", routePopulateFields);

    if (req.user.role === "admin") {
      query.populate("createdBy", "fullName email role");
    }

    const bus = await query;

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    return res.status(200).json(bus);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getBusesByRoute = async (req, res) => {
  try {
    const { routeId } = req.params;

    if (!isValidObjectId(routeId)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    const route = await Route.findById(routeId);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const query = applyBusVisibility(
      Bus.find({
        assignedRoute: routeId,
        ...(req.user.role === "admin" ? {} : { status: "Available" }),
      }),
      req.user
    )
      .populate("assignedRoute", routePopulateFields)
      .sort({ createdAt: -1 });

    if (req.user.role === "admin") {
      query.populate("createdBy", "fullName email role");
    }

    const buses = await query;

    return res.status(200).json(buses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAvailableBuses = async (req, res) => {
  try {
    const query = applyBusVisibility(
      Bus.find({ status: "Available" }),
      req.user
    )
      .populate("assignedRoute", routePopulateFields)
      .sort({ createdAt: -1 });

    if (req.user.role === "admin") {
      query.populate("createdBy", "fullName email role");
    }

    const buses = await query;

    return res.status(200).json(buses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateBus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid bus ID" });
    }

    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const {
      busName,
      licenseNumber,
      driverName,
      driverNIC,
      conductorName,
      conductorNIC,
      busContactNumber,
      seatCount,
      busType,
      assignedRoute,
      status,
    } = req.body;

    if (
      seatCount !== undefined &&
      (!isPositiveNumber(seatCount) ||
        !Number.isInteger(Number(seatCount)) ||
        Number(seatCount) > 100)
    ) {
      return res.status(400).json({
        message: "Seat count must be between 1 and 100",
      });
    }
    if (busType && !VALID_BUS_TYPES.has(busType)) {
      return res.status(400).json({ message: "Invalid bus type" });
    }
    if (status && !VALID_BUS_STATUSES.has(status)) {
      return res.status(400).json({ message: "Invalid bus status" });
    }

    if (seatCount !== undefined && Number(seatCount) < bus.seatCount) {
      const scheduleIds = await Schedule.find({ busId: id }).distinct("_id");
      const bookingAboveCapacity = await Booking.exists({
        scheduleId: { $in: scheduleIds },
        seatNumbers: { $elemMatch: { $gt: Number(seatCount) } },
      });

      if (bookingAboveCapacity) {
        return res.status(409).json({
          message: "Seat count cannot be reduced below seats used in booking history",
        });
      }
    }

    if (
      assignedRoute !== undefined &&
      assignedRoute !== null &&
      assignedRoute !== ""
    ) {
      if (!isValidObjectId(assignedRoute)) {
        return res.status(400).json({ message: "Invalid route ID" });
      }

      const routeExists = await Route.findById(assignedRoute);

      if (!routeExists) {
        return res.status(404).json({ message: "Assigned route not found" });
      }
    }

    if (status && status !== "Available" && bus.status === "Available") {
      const scheduledTrip = await Schedule.exists({
        busId: id,
        status: "Scheduled",
      });
      if (scheduledTrip) {
        return res.status(409).json({
          message: "Complete or cancel upcoming schedules before changing this bus's availability",
        });
      }
    }

    if (assignedRoute !== undefined) {
      const normalizedRoute = assignedRoute || null;
      const routeChanged =
        String(normalizedRoute || "") !== String(bus.assignedRoute || "");

      if (routeChanged) {
        const conflictingSchedule = await Schedule.exists({
          busId: id,
          status: "Scheduled",
          ...(normalizedRoute ? { routeId: { $ne: normalizedRoute } } : {}),
        });
        if (conflictingSchedule) {
          return res.status(409).json({
            message: "Complete or cancel upcoming schedules before changing this bus's route",
          });
        }
      }
    }

    if (
      licenseNumber &&
      licenseNumber.trim().toUpperCase() !== bus.licenseNumber
    ) {
      const existingBus = await Bus.findOne({
        licenseNumber: licenseNumber.trim().toUpperCase(),
      });

      if (existingBus) {
        return res.status(400).json({
          message: "Bus license number already exists",
        });
      }
    }

    bus.busName = busName?.trim() ?? bus.busName;
    bus.licenseNumber =
      licenseNumber?.trim().toUpperCase() ?? bus.licenseNumber;
    bus.driverName = driverName?.trim() ?? bus.driverName;
    bus.driverNIC = driverNIC?.trim() ?? bus.driverNIC;
    bus.conductorName = conductorName?.trim() ?? bus.conductorName;
    bus.conductorNIC = conductorNIC?.trim() ?? bus.conductorNIC;
    bus.busContactNumber =
      busContactNumber?.trim() ?? bus.busContactNumber;
    bus.seatCount =
      seatCount !== undefined ? Number(seatCount) : bus.seatCount;
    bus.busType = busType ?? bus.busType;
    bus.status = status ?? bus.status;

    if (assignedRoute !== undefined) {
      bus.assignedRoute = assignedRoute || null;
    }

    await bus.save();

    const updatedBus = await Bus.findById(bus._id)
      .populate("assignedRoute", routePopulateFields)
      .populate("createdBy", "fullName email role");

    return res.status(200).json({
      message: "Bus updated successfully",
      bus: updatedBus,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.assignBusToRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { routeId } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid bus ID" });
    }

    if (!routeId || !isValidObjectId(routeId)) {
      return res.status(400).json({ message: "Valid route ID is required" });
    }

    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const conflictingSchedule = await Schedule.exists({
      busId: id,
      status: "Scheduled",
      routeId: { $ne: routeId },
    });
    if (conflictingSchedule) {
      return res.status(409).json({
        message: "Complete or cancel this bus's existing schedules before assigning another route",
      });
    }

    const route = await Route.findById(routeId);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    bus.assignedRoute = routeId;

    await bus.save();

    const updatedBus = await Bus.findById(bus._id)
      .populate("assignedRoute", routePopulateFields)
      .populate("createdBy", "fullName email role");

    return res.status(200).json({
      message: "Bus assigned to route successfully",
      bus: updatedBus,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.removeBusFromRoute = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid bus ID" });
    }

    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const scheduledTrip = await Schedule.exists({
      busId: id,
      status: "Scheduled",
    });
    if (scheduledTrip) {
      return res.status(409).json({
        message: "Complete or cancel this bus's schedules before removing its route",
      });
    }

    bus.assignedRoute = null;

    await bus.save();

    const updatedBus = await Bus.findById(bus._id)
      .populate("assignedRoute", routePopulateFields)
      .populate("createdBy", "fullName email role");

    return res.status(200).json({
      message: "Bus removed from route successfully",
      bus: updatedBus,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteBus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid bus ID" });
    }

    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const scheduleCount = await Schedule.countDocuments({ busId: id });
    if (scheduleCount > 0) {
      return res.status(409).json({
        message: "Buses with schedule history cannot be deleted. Mark the bus inactive instead.",
      });
    }

    await Bus.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Bus deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
