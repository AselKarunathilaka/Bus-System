const Route = require("../models/Route");
const Stop = require("../models/Stop");

exports.createRoute = async (req, res) => {
  try {
    const { routeName, startLocation, endLocation, price, status } = req.body;

    if (!routeName || !startLocation || !endLocation || price === undefined) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const route = await Route.create({
      routeName,
      startLocation,
      endLocation,
      price,
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
      .sort({ createdAt: -1 });

    return res.status(200).json(routes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate(
      "createdBy",
      "fullName email role"
    );

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    return res.status(200).json(route);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const { routeName, startLocation, endLocation, price, status } = req.body;

    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    route.routeName = routeName ?? route.routeName;
    route.startLocation = startLocation ?? route.startLocation;
    route.endLocation = endLocation ?? route.endLocation;
    route.price = price ?? route.price;
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
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    await Stop.deleteMany({ routeId: route._id });
    await Route.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Route and related stops deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};