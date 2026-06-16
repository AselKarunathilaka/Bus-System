const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Schedule = require("../models/Schedule");
const { getPaymentProvider } = require("../services/payment/paymentProvider");
const { releaseExpiredBookings } = require("../utils/releaseExpiredBookings");

exports.initiatePayment = async (req, res) => {
  await releaseExpiredBookings();

  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("userId", "fullName email phone");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (req.user.role !== "admin" && booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to pay for this booking" });
    }

    if (booking.status !== "PendingPayment" || booking.paymentStatus !== "Pending") {
      return res.status(400).json({ message: `Cannot initiate payment. Booking status: ${booking.status}` });
    }

    if (booking.paymentExpiresAt && booking.paymentExpiresAt < new Date()) {
      return res.status(400).json({ message: "Payment time has expired. Please create a new booking." });
    }

    const providerService = getPaymentProvider();
    
    const customer = {
      name: booking.userId.fullName || booking.passengerName || "Customer",
      email: booking.userId.email || "customer@example.com",
      phone: booking.userId.phone || booking.contactNumber || "0000000000"
    };

    const paymentDetails = await providerService.initiatePayment(
      booking,
      booking.totalPrice,
      booking.currency || "LKR",
      customer
    );

    // Create Payment record
    const payment = new Payment({
      bookingId: booking._id,
      userId: req.user._id,
      provider: paymentDetails.provider,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      status: "Pending",
      paymentReference: paymentDetails.paymentReference,
      gatewayPayload: paymentDetails.gatewayPayload
    });

    await payment.save();

    booking.paymentProvider = paymentDetails.provider;
    booking.paymentReference = paymentDetails.paymentReference;
    await booking.save();

    res.status(200).json(paymentDetails);
  } catch (error) {
    console.error("Payment initiation error:", error);
    res.status(500).json({ message: "Failed to initiate payment", error: error.message });
  }
};

exports.payhereNotify = async (req, res) => {
  try {
    const payload = req.body;
    const providerService = require("../services/payment/payhereProvider");
    
    const verification = await providerService.verifyPayment(payload);
    
    if (!verification.verified) {
      console.warn("PayHere notification verification failed:", verification.failureReason);
      // Still return 200 to acknowledge receipt to PayHere
      return res.status(200).send();
    }

    await handlePaymentCallback(verification);
    
    res.status(200).send();
  } catch (error) {
    console.error("PayHere notify error:", error);
    res.status(500).send();
  }
};

exports.mockSuccess = async (req, res) => {
  try {
    const { paymentReference } = req.params;
    const providerService = require("../services/payment/mockPaymentProvider");
    
    const verification = await providerService.verifyPayment({
      paymentReference,
      status: "success"
    });
    
    await handlePaymentCallback(verification);
    
    res.status(200).json({ message: "Mock payment successful" });
  } catch (error) {
    console.error("Mock success error:", error);
    res.status(500).json({ message: "Failed to process mock payment", error: error.message });
  }
};

exports.mockFail = async (req, res) => {
  try {
    const { paymentReference } = req.params;
    const providerService = require("../services/payment/mockPaymentProvider");
    
    const verification = await providerService.verifyPayment({
      paymentReference,
      status: "failed"
    });
    
    await handlePaymentCallback(verification);
    
    res.status(200).json({ message: "Mock payment failed processed" });
  } catch (error) {
    console.error("Mock fail error:", error);
    res.status(500).json({ message: "Failed to process mock payment failure", error: error.message });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { paymentReference } = req.params;
    const payment = await Payment.findOne({ paymentReference });
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    if (req.user.role !== "admin" && payment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({
      paymentReference: payment.paymentReference,
      status: payment.status,
      amount: payment.amount,
      provider: payment.provider,
      verifiedAt: payment.verifiedAt
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get payment status", error: error.message });
  }
};

// Internal helper
async function handlePaymentCallback(verification) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payment = await Payment.findOne({ paymentReference: verification.paymentReference }).session(session);
    
    if (!payment) {
      console.warn(`Payment reference ${verification.paymentReference} not found`);
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // Idempotent check
    if (payment.status !== "Pending") {
      await session.abortTransaction();
      session.endSession();
      return;
    }

    const booking = await Booking.findById(payment.bookingId).session(session);
    
    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return;
    }

    payment.status = verification.status;
    payment.gatewayPaymentId = verification.gatewayPaymentId;
    payment.verifiedAt = new Date();
    payment.failureReason = verification.failureReason;
    
    await payment.save({ session });

    if (verification.status === "Paid") {
      booking.status = "Confirmed";
      booking.paymentStatus = "Paid";
      booking.paidAt = new Date();
      booking.gatewayOrderId = payment.paymentReference;
      booking.gatewayPaymentId = verification.gatewayPaymentId;
      await booking.save({ session });
    } else if (verification.status === "Failed" || verification.status === "Cancelled") {
      booking.status = "PaymentFailed";
      booking.paymentStatus = "Failed";
      booking.paymentFailureReason = verification.failureReason;
      await booking.save({ session });

      // Release seats
      await Schedule.updateOne(
        { _id: booking.scheduleId },
        { $pullAll: { bookedSeats: booking.seatNumbers } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}
