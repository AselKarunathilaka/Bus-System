const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const createRateLimit = require("../middleware/rateLimit");

const contactRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many support messages. Please try again later.",
});

// Public route to submit a contact message
router.post("/", contactRateLimit, contactController.createContactMessage);

// Admin only routes
router.get("/", authMiddleware, roleMiddleware("admin"), contactController.getContactMessages);
router.put("/:id/status", authMiddleware, roleMiddleware("admin"), contactController.updateMessageStatus);

module.exports = router;
