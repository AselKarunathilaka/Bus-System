const mongoose = require("mongoose");
const Route = require("../models/Route");
const Stop = require("../models/Stop");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createRoute = async (req, res) => {
  try {
    const {
      routeName,
      startLocation,
      endLocation,
      price,
      distanceKm,
      estimatedDuration,
      description,
      status,
    } = req.body;

    if (
      !routeName?.trim() ||
      !startLocation?.trim() ||
      !endLocation?.trim() ||
      price === undefined ||
      distanceKm === undefined ||
      !estimatedDuration?.trim()
    ) {
      return res.status(400).json({
        message: "Route name, locations, price, distance and duration are required",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({ message: "Price must be 0 or greater" });
    }

    if (Number(distanceKm) <= 0) {
      return res.status(400).json({ message: "Distance must be greater than 0" });
    }

    const route = await Route.create({
      routeName: routeName.trim(),
      startLocation: startLocation.trim(),
      endLocation: endLocation.trim(),
      price: Number(price),
      distanceKm: Number(distanceKm),
      estimatedDuration: estimatedDuration.trim(),
      description: description?.trim() || "",
      status: status || "active",
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "Route created successfully",
      route,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find()
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 })
      .lean();

    const routeIds = routes.map((route) => route._id);

    const stops = await Stop.find({ routeId: { $in: routeIds } })
      .sort({ order: 1 })
      .lean();

    const stopsMap = {};
    for (const stop of stops) {
      const key = stop.routeId.toString();
      if (!stopsMap[key]) stopsMap[key] = [];
      stopsMap[key].push(stop);
    }

    const routesWithStops = routes.map((route) => ({
      ...route,
      stops: stopsMap[route._id.toString()] || [],
      stopCount: (stopsMap[route._id.toString()] || []).length,
    }));

    return res.status(200).json(routesWithStops);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getRouteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    const route = await Route.findById(id)
      .populate("createdBy", "fullName email role")
      .lean();

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const stops = await Stop.find({ routeId: id }).sort({ order: 1 }).lean();

    return res.status(200).json({
      ...route,
      stops,
      stopCount: stops.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    const {
      routeName,
      startLocation,
      endLocation,
      price,
      distanceKm,
      estimatedDuration,
      description,
      status,
    } = req.body;

    const route = await Route.findById(id);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({ message: "Price must be 0 or greater" });
    }

    if (distanceKm !== undefined && Number(distanceKm) <= 0) {
      return res.status(400).json({ message: "Distance must be greater than 0" });
    }

    route.routeName = routeName?.trim() ?? route.routeName;
    route.startLocation = startLocation?.trim() ?? route.startLocation;
    route.endLocation = endLocation?.trim() ?? route.endLocation;
    route.price = price !== undefined ? Number(price) : route.price;
    route.distanceKm = distanceKm !== undefined ? Number(distanceKm) : route.distanceKm;
    route.estimatedDuration = estimatedDuration?.trim() ?? route.estimatedDuration;
    route.description = description !== undefined ? description.trim() : route.description;
    route.status = status ?? route.status;

    await route.save();

    return res.status(200).json({
      message: "Route updated successfully",
      route,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    const route = await Route.findById(id);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    await Stop.deleteMany({ routeId: route._id });
    await Route.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Route and related stops deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};