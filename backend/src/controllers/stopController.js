const mongoose = require("mongoose");
const Stop = require("../models/Stop");
const Route = require("../models/Route");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createStop = async (req, res) => {
  try {
    const { stopName, location, order, routeId } = req.body;

    if (!stopName?.trim() || !location?.trim() || order === undefined || !routeId) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (!isValidObjectId(routeId)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    if (Number(order) <= 0) {
      return res.status(400).json({ message: "Stop order must be greater than 0" });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const existingStopOrder = await Stop.findOne({ routeId, order: Number(order) });
    if (existingStopOrder) {
      return res.status(400).json({
        message: "A stop with this order already exists for this route",
      });
    }

    const stop = await Stop.create({
      stopName: stopName.trim(),
      location: location.trim(),
      order: Number(order),
      routeId,
    });

    return res.status(201).json({
      message: "Stop created successfully",
      stop,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getStopsByRoute = async (req, res) => {
  try {
    const { routeId } = req.params;

    if (!isValidObjectId(routeId)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    const stops = await Stop.find({ routeId }).sort({ order: 1 });

    return res.status(200).json(stops);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getStopById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid stop ID" });
    }

    const stop = await Stop.findById(id).populate(
      "routeId",
      "routeName startLocation endLocation price distanceKm estimatedDuration status"
    );

    if (!stop) {
      return res.status(404).json({ message: "Stop not found" });
    }

    return res.status(200).json(stop);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateStop = async (req, res) => {
  try {
    const { id } = req.params;
    const { stopName, location, order } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid stop ID" });
    }

    const stop = await Stop.findById(id);

    if (!stop) {
      return res.status(404).json({ message: "Stop not found" });
    }

    if (order !== undefined) {
      if (Number(order) <= 0) {
        return res.status(400).json({ message: "Stop order must be greater than 0" });
      }

      if (Number(order) !== stop.order) {
        const existingStopOrder = await Stop.findOne({
          routeId: stop.routeId,
          order: Number(order),
          _id: { $ne: stop._id },
        });

        if (existingStopOrder) {
          return res.status(400).json({
            message: "A stop with this order already exists for this route",
          });
        }
      }
    }

    stop.stopName = stopName?.trim() ?? stop.stopName;
    stop.location = location?.trim() ?? stop.location;
    stop.order = order !== undefined ? Number(order) : stop.order;

    await stop.save();

    return res.status(200).json({
      message: "Stop updated successfully",
      stop,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteStop = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid stop ID" });
    }

    const stop = await Stop.findById(id);

    if (!stop) {
      return res.status(404).json({ message: "Stop not found" });
    }

    await Stop.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Stop deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};