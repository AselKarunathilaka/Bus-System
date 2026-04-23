<<<<<<< HEAD
const mongoose = require("mongoose");
const Stop = require("../models/Stop");
const Route = require("../models/Route");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

=======
const Stop = require("../models/Stop");
const Route = require("../models/Route");

>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
exports.createStop = async (req, res) => {
  try {
    const { stopName, location, order, routeId } = req.body;

<<<<<<< HEAD
    if (!stopName?.trim() || !location?.trim() || order === undefined || !routeId) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (!isValidObjectId(routeId)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    if (Number(order) <= 0) {
      return res.status(400).json({ message: "Stop order must be greater than 0" });
    }

=======
    if (!stopName || !location || !order || !routeId) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

<<<<<<< HEAD
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
=======
    const existingStopOrder = await Stop.findOne({ routeId, order });
    if (existingStopOrder) {
      return res.status(400).json({ message: "A stop with this order already exists for this route" });
    }

    const stop = await Stop.create({
      stopName,
      location,
      order,
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
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

<<<<<<< HEAD
    if (!isValidObjectId(routeId)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

=======
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
    const stops = await Stop.find({ routeId }).sort({ order: 1 });

    return res.status(200).json(stops);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getStopById = async (req, res) => {
  try {
<<<<<<< HEAD
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid stop ID" });
    }

    const stop = await Stop.findById(id).populate(
      "routeId",
      "routeName startLocation endLocation price distanceKm estimatedDuration status"
=======
    const stop = await Stop.findById(req.params.id).populate(
      "routeId",
      "routeName startLocation endLocation price status"
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
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
<<<<<<< HEAD
    const { id } = req.params;
    const { stopName, location, order } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid stop ID" });
    }

    const stop = await Stop.findById(id);
=======
    const { stopName, location, order } = req.body;

    const stop = await Stop.findById(req.params.id);
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94

    if (!stop) {
      return res.status(404).json({ message: "Stop not found" });
    }

<<<<<<< HEAD
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
=======
    if (order !== undefined && order !== stop.order) {
      const existingStopOrder = await Stop.findOne({
        routeId: stop.routeId,
        order,
        _id: { $ne: stop._id },
      });

      if (existingStopOrder) {
        return res.status(400).json({ message: "A stop with this order already exists for this route" });
      }
    }

    stop.stopName = stopName ?? stop.stopName;
    stop.location = location ?? stop.location;
    stop.order = order ?? stop.order;
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94

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
<<<<<<< HEAD
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid stop ID" });
    }

    const stop = await Stop.findById(id);
=======
    const stop = await Stop.findById(req.params.id);
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94

    if (!stop) {
      return res.status(404).json({ message: "Stop not found" });
    }

<<<<<<< HEAD
    await Stop.findByIdAndDelete(id);
=======
    await Stop.findByIdAndDelete(req.params.id);
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94

    return res.status(200).json({
      message: "Stop deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};