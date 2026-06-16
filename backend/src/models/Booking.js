const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    seatNumbers: {
      type: [Number],
      required: true,
      validate: [
        (val) => val.length > 0 && val.length <= 8,
        "Seat numbers must be between 1 and 8 seats.",
      ],
    },
    bookingType: {
      type: String,
      enum: ["Single", "Family"],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Confirmed", "Cancelled"],
      default: "Confirmed",
    },
    contactNumber: {
      type: String,
      required: false,
    },
    passengerName: {
      type: String,
      required: false,
      trim: true,
    },
    passengerPhone: {
      type: String,
      required: false,
      trim: true,
    },
    createdByRole: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isManualBooking: {
      type: Boolean,
      default: false,
    },
    adminNote: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ scheduleId: 1, status: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
