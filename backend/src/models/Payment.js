const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    provider: {
      type: String,
      enum: ["payhere", "stripe", "mock"],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: "LKR"
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Cancelled", "Refunded", "Expired"],
      default: "Pending"
    },
    paymentReference: {
      type: String,
      required: true,
      unique: true
    },
    gatewayOrderId: String,
    gatewayPaymentId: String,
    gatewayStatus: String,
    gatewayPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    verifiedAt: Date,
    failureReason: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
