const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const mapController = require("../controllers/mapController");

const router = express.Router();

// Public/User routes
router.get("/routes/:routeId", protect, mapController.getRouteMapData);

// Admin routes
router.post("/routes/:routeId/sync", protect, adminOnly, mapController.syncRouteMapData);

module.exports = router;
