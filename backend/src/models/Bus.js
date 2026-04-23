const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busName: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    busType: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    driverName: { type: String, required: true },
    conductorName: { type: String, required: true },

    status: {
      type: String,
      enum: ["Available", "Assigned", "Unavailable"],
      default: "Available",
    },

    // ✅ THIS IS YOUR TEMP ROUTE ASSIGN
    assignedRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);