const axios = require("axios");
const Route = require("../models/Route");
const Stop = require("../models/Stop");

const getCoordinates = async (locationName) => {
  try {
    // Add Sri Lanka to query to get more accurate results
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName + ", Sri Lanka")}&format=json&limit=1`, {
      headers: {
        "User-Agent": "BusBookingSystem/1.0"
      }
    });
    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error(`Geocoding error for ${locationName}:`, error.message);
    return null;
  }
};

exports.computeRouteOverview = async (routeId) => {
  try {
    const route = await Route.findById(routeId);
    if (!route) {
      throw new Error("Route not found");
    }

    // Geocode start and end if missing or invalid
    if (!route.startCoordinates || !route.startCoordinates.lat || route.mapStatus === "missing_coordinates") {
      const startCoords = await getCoordinates(route.startLocation);
      if (startCoords) route.startCoordinates = startCoords;
    }
    
    if (!route.endCoordinates || !route.endCoordinates.lat || route.mapStatus === "missing_coordinates") {
      const endCoords = await getCoordinates(route.endLocation);
      if (endCoords) route.endCoordinates = endCoords;
    }

    if (!route.startCoordinates || !route.endCoordinates || !route.startCoordinates.lat || !route.endCoordinates.lat) {
      throw new Error("Route start or end coordinates could not be determined");
    }

    const stops = await Stop.find({ routeId }).sort({ order: 1 });
    
    // Build coordinate string for OSRM: {longitude},{latitude};{longitude},{latitude}
    const waypoints = [route.startCoordinates];
    
    for (const stop of stops) {
      if (!stop.coordinates || !stop.coordinates.lat) {
        const coords = await getCoordinates(stop.location || stop.stopName);
        if (coords) {
          stop.coordinates = coords;
          await stop.save();
        }
      }
      if (stop.coordinates && stop.coordinates.lat) {
        waypoints.push(stop.coordinates);
      }
    }
    
    waypoints.push(route.endCoordinates);

    const coordsString = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(";");

    // Wait 1 second before calling OSRM to be nice to public API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // OSRM Public API
    const response = await axios.get(
      `http://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full`
    );

    if (!response.data.routes || response.data.routes.length === 0) {
      throw new Error("No routes returned from OSRM API");
    }

    const routeData = response.data.routes[0];

    // Update Route model
    route.routePolyline = routeData.geometry || "";
    route.routeDistanceMeters = routeData.distance || 0;
    route.routeDurationSeconds = routeData.duration || 0;
    
    route.mapStatus = "ready";
    route.mapLastSyncedAt = new Date();

    await route.save();
    
    return route;
  } catch (error) {
    console.error(`Route API Error for route ${routeId}:`, error?.response?.data || error.message);
    
    try {
      await Route.findByIdAndUpdate(routeId, {
        mapStatus: "sync_failed",
        mapLastSyncedAt: new Date()
      });
    } catch (updateError) {
      console.error("Failed to update route map status:", updateError);
    }
    
    throw error;
  }
};
