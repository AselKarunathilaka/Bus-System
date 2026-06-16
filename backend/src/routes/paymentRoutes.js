const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

// User routes
router.post("/initiate/:bookingId", protect, paymentController.initiatePayment);
router.get("/:paymentReference/status", protect, paymentController.getPaymentStatus);

// Mock payment callbacks (can be public or require a test secret, keeping simple for now)
router.post("/mock/success/:paymentReference", paymentController.mockSuccess);
router.post("/mock/fail/:paymentReference", paymentController.mockFail);

// PayHere callback (Must be public, verification happens via hash in controller)
router.post("/payhere/notify", paymentController.payhereNotify);

module.exports = router;
