const axios = require("axios");
const Route = require("../models/Route");
const Stop = require("../models/Stop");

exports.computeRouteOverview = async (routeId) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_MAPS_API_KEY is not set");
    }

    const route = await Route.findById(routeId);
    if (!route) {
      throw new Error("Route not found");
    }

    if (!route.startCoordinates || !route.endCoordinates || !route.startCoordinates.lat || !route.endCoordinates.lat) {
      throw new Error("Route start or end coordinates are missing");
    }

    const stops = await Stop.find({ routeId }).sort({ order: 1 });
    
    // Build waypoints from stops that have coordinates
    const waypoints = stops
      .filter(stop => stop.coordinates && stop.coordinates.lat && stop.coordinates.lng)
      .map(stop => ({
        location: {
          latLng: {
            latitude: stop.coordinates.lat,
            longitude: stop.coordinates.lng
          }
        }
      }));

    const requestBody = {
      origin: {
        location: {
          latLng: {
            latitude: route.startCoordinates.lat,
            longitude: route.startCoordinates.lng
          }
        }
      },
      destination: {
        location: {
          latLng: {
            latitude: route.endCoordinates.lat,
            longitude: route.endCoordinates.lng
          }
        }
      },
      intermediates: waypoints,
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      polylineEncoding: "ENCODED_POLYLINE",
      computeAlternativeRoutes: false,
    };

    const response = await axios.post(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
        }
      }
    );

    if (!response.data.routes || response.data.routes.length === 0) {
      throw new Error("No routes returned from Google API");
    }

    const routeData = response.data.routes[0];

    // Update Route model
    route.routePolyline = routeData.polyline?.encodedPolyline || "";
    route.routeDistanceMeters = routeData.distanceMeters || 0;
    
    // Parse duration (e.g., "1200s")
    let durationSeconds = 0;
    if (routeData.duration) {
      durationSeconds = parseInt(routeData.duration.replace("s", ""), 10);
    }
    route.routeDurationSeconds = durationSeconds;
    
    route.mapStatus = "ready";
    route.mapLastSyncedAt = new Date();

    await route.save();
    
    return route;
  } catch (error) {
    console.error(`Google Routes API Error for route ${routeId}:`, error?.response?.data || error.message);
    
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
