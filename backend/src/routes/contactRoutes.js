const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public route to submit a contact message
router.post("/", contactController.createContactMessage);

// Admin only routes
router.get("/", authMiddleware, adminMiddleware, contactController.getContactMessages);
router.put("/:id/status", authMiddleware, adminMiddleware, contactController.updateMessageStatus);

module.exports = router;
