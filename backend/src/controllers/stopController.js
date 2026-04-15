const Stop = require("../models/Stop");
const Route = require("../models/Route");

exports.createStop = async (req, res) => {
  try {
    const { stopName, location, order, routeId } = req.body;

    if (!stopName || !location || !order || !routeId) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const existingStopOrder = await Stop.findOne({ routeId, order });
    if (existingStopOrder) {
      return res.status(400).json({ message: "A stop with this order already exists for this route" });
    }

    const stop = await Stop.create({
      stopName,
      location,
      order,
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

    const stops = await Stop.find({ routeId }).sort({ order: 1 });

    return res.status(200).json(stops);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getStopById = async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id).populate(
      "routeId",
      "routeName startLocation endLocation price status"
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
    const { stopName, location, order } = req.body;

    const stop = await Stop.findById(req.params.id);

    if (!stop) {
      return res.status(404).json({ message: "Stop not found" });
    }

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
    const stop = await Stop.findById(req.params.id);

    if (!stop) {
      return res.status(404).json({ message: "Stop not found" });
    }

    await Stop.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Stop deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};