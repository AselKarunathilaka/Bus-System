const Route = require("../models/Route");

// ======================
// CREATE ROUTE
// POST /api/routes
// ======================
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
      !routeName ||
      !startLocation ||
      !endLocation ||
      price === undefined ||
      distanceKm === undefined ||
      !estimatedDuration
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const route = await Route.create({
      routeName,
      startLocation,
      endLocation,
      price,
      distanceKm,
      estimatedDuration,
      description,
      status,
    });

    res.status(201).json({
      message: "Route created successfully",
      route,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create route",
      error: error.message,
    });
  }
};

// ======================
// GET ALL ROUTES
// GET /api/routes
// ======================
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });

    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get routes",
      error: error.message,
    });
  }
};

// ======================
// GET ROUTE BY ID
// GET /api/routes/:id
// ======================
exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        message: "Route not found",
      });
    }

    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get route",
      error: error.message,
    });
  }
};

// ======================
// UPDATE ROUTE
// PUT /api/routes/:id
// ======================
exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!route) {
      return res.status(404).json({
        message: "Route not found",
      });
    }

    res.status(200).json({
      message: "Route updated successfully",
      route,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update route",
      error: error.message,
    });
  }
};

// ======================
// DELETE ROUTE
// DELETE /api/routes/:id
// ======================
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);

    if (!route) {
      return res.status(404).json({
        message: "Route not found",
      });
    }

    res.status(200).json({
      message: "Route deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete route",
      error: error.message,
    });
  }
};