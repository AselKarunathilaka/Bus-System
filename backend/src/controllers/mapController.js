const Route = require("../models/Route");
const Stop = require("../models/Stop");
const { computeRouteOverview } = require("../services/googleRoutesService");

exports.getRouteMapData = async (req, res) => {
  try {
    const { routeId } = req.params;
    
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    if (route.mapStatus !== "ready") {
      return res.status(200).json({
        routeId: route._id,
        mapStatus: route.mapStatus,
        message: "Map preview is unavailable because route coordinates are incomplete or syncing failed."
      });
    }

    const stops = await Stop.find({ routeId }).sort({ order: 1 });

    const formattedStops = stops.map(stop => ({
      _id: stop._id,
      stopName: stop.stopName,
      location: stop.location,
      order: stop.order,
      coordinates: stop.coordinates
    }));

    res.status(200).json({
      routeId: route._id,
      routeName: route.routeName,
      startLocation: route.startLocation,
      endLocation: route.endLocation,
      startCoordinates: route.startCoordinates,
      endCoordinates: route.endCoordinates,
      routePolyline: route.routePolyline,
      routeDistanceMeters: route.routeDistanceMeters,
      routeDurationSeconds: route.routeDurationSeconds,
      mapStatus: route.mapStatus,
      mapLastSyncedAt: route.mapLastSyncedAt,
      stops: formattedStops
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get route map data", error: error.message });
  }
};

exports.syncRouteMapData = async (req, res) => {
  try {
    const { routeId } = req.params;
    
    // Validate route exists
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const updatedRoute = await computeRouteOverview(routeId);
    
    res.status(200).json({
      message: "Route map data synced successfully",
      route: updatedRoute
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to sync route map data", error: error.message });
  }
};
