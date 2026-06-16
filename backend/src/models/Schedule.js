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
      validate: [
        (value) =>
          value.every((seat) => Number.isInteger(seat) && seat > 0) &&
          new Set(value).size === value.length,
        "Booked seats must contain unique positive integers",
      ],
    },
  },
  { timestamps: true }
);

scheduleSchema.index({ busId: 1, departureDate: 1, status: 1 });
scheduleSchema.index({ routeId: 1, departureDate: 1, status: 1 });

module.exports = mongoose.model("Schedule", scheduleSchema);
