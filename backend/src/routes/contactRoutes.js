const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public route to submit a contact message
router.post("/", contactController.createContactMessage);

// Admin only routes
router.get("/", authMiddleware, roleMiddleware("admin"), contactController.getContactMessages);
router.put("/:id/status", authMiddleware, roleMiddleware("admin"), contactController.updateMessageStatus);

module.exports = router;
