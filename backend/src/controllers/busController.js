const mongoose = require("mongoose");
const Bus = require("../models/Bus");
const Route = require("../models/Route");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const routePopulateFields =
  "routeName startLocation endLocation price distanceKm estimatedDuration status";

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

    if (Number(seatCount) <= 0 || Number(seatCount) > 100) {
      return res.status(400).json({
        message: "Seat count must be between 1 and 100",
      });
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
    const buses = await Bus.find()
      .populate("assignedRoute", routePopulateFields)
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

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

    const bus = await Bus.findById(id)
      .populate("assignedRoute", routePopulateFields)
      .populate("createdBy", "fullName email role");

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

    const buses = await Bus.find({ assignedRoute: routeId })
      .populate("assignedRoute", routePopulateFields)
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json(buses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAvailableBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ status: "Available" })
      .populate("assignedRoute", routePopulateFields)
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

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
      (Number(seatCount) <= 0 || Number(seatCount) > 100)
    ) {
      return res.status(400).json({
        message: "Seat count must be between 1 and 100",
      });
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

    await Bus.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Bus deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};