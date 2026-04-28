const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busName: {
      type: String,
      required: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    driverName: {
      type: String,
      required: true,
      trim: true,
    },
    driverNIC: {
      type: String,
      required: true,
      trim: true,
    },
    conductorName: {
      type: String,
      required: true,
      trim: true,
    },
    conductorNIC: {
      type: String,
      required: true,
      trim: true,
    },
    busContactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    seatCount: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    busType: {
      type: String,
      enum: ["Normal", "Semi Luxury", "Luxury", "Super Luxury"],
      required: true,
    },

    // Route assignment
    assignedRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      default: null,
    },

    // Bus condition/status
    status: {
      type: String,
      enum: ["Available", "Maintenance", "Inactive"],
      default: "Available",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);