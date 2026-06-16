const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
      trim: true,
    },
    startLocation: {
      type: String,
      required: true,
      trim: true,
    },
    endLocation: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    distanceKm: {
      type: Number,
      required: true,
      min: 1,
    },
    estimatedDuration: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    startCoordinates: {
      lat: Number,
      lng: Number
    },
    endCoordinates: {
      lat: Number,
      lng: Number
    },
    routePolyline: {
      type: String,
      default: ""
    },
    routeDistanceMeters: {
      type: Number,
      default: 0
    },
    routeDurationSeconds: {
      type: Number,
      default: 0
    },
    mapProvider: {
      type: String,
      default: "google"
    },
    mapLastSyncedAt: Date,
    mapStatus: {
      type: String,
      enum: ["missing_coordinates", "ready", "sync_failed"],
      default: "missing_coordinates"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Route", routeSchema);