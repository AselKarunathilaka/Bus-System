const Bus = require("../models/Bus");

// ======================
// CREATE BUS
// ======================
exports.createBus = async (req, res) => {
  try {
    const {
      busName,
      licenseNumber,
      busType,
      totalSeats,
      driverName,
      conductorName,
      status,
      assignedRoute,
    } = req.body;

    // Validation
    if (
      !busName ||
      !licenseNumber ||
      !busType ||
      !totalSeats ||
      !driverName ||
      !conductorName
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    if (isNaN(totalSeats) || totalSeats <= 0) {
      return res
        .status(400)
        .json({ message: "Total seats must be a valid number" });
    }

    // Check duplicate license
    const existingBus = await Bus.findOne({ licenseNumber });
    if (existingBus) {
      return res
        .status(400)
        .json({ message: "Bus with this license number already exists" });
    }

    const bus = await Bus.create({
      busName: busName.trim(),
      licenseNumber: licenseNumber.trim(),
      busType: busType.trim(),
      totalSeats,
      driverName: driverName.trim(),
      conductorName: conductorName.trim(),
      status: status || "Available",
      assignedRoute: assignedRoute || null,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      message: "Bus created successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create bus",
      error: error.message,
    });
  }
};

// ======================
// GET ALL BUSES
// ======================
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find()
      .populate("assignedRoute", "routeName")
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch buses",
      error: error.message,
    });
  }
};

// ======================
// GET BUS BY ID
// ======================
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id)
      .populate("assignedRoute", "routeName")
      .populate("createdBy", "fullName email");

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json(bus);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bus",
      error: error.message,
    });
  }
};

// ======================
// UPDATE BUS
// ======================
exports.updateBus = async (req, res) => {
  try {
    const { id } = req.params;

    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const {
      busName,
      licenseNumber,
      busType,
      totalSeats,
      driverName,
      conductorName,
      status,
      assignedRoute,
    } = req.body;

    if (totalSeats && (isNaN(totalSeats) || totalSeats <= 0)) {
      return res
        .status(400)
        .json({ message: "Total seats must be a valid number" });
    }

    bus.busName = busName ?? bus.busName;
    bus.licenseNumber = licenseNumber ?? bus.licenseNumber;
    bus.busType = busType ?? bus.busType;
    bus.totalSeats = totalSeats ?? bus.totalSeats;
    bus.driverName = driverName ?? bus.driverName;
    bus.conductorName = conductorName ?? bus.conductorName;
    bus.status = status ?? bus.status;
    bus.assignedRoute =
      assignedRoute !== undefined ? assignedRoute : bus.assignedRoute;

    await bus.save();

    res.status(200).json({
      message: "Bus updated successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update bus",
      error: error.message,
    });
  }
};

// ======================
// DELETE BUS
// ======================
exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json({
      message: "Bus deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete bus",
      error: error.message,
    });
  }
};

// ======================
// GET AVAILABLE BUSES
// ======================
exports.getAvailableBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ status: "Available" })
      .populate("assignedRoute", "routeName")
      .sort({ createdAt: -1 });

    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch available buses",
      error: error.message,
    });
  }
};