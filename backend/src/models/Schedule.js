const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
      trim: true,
    },
    arrivalTime: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    bookedSeats: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
