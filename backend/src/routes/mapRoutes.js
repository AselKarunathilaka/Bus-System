const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const mapController = require("../controllers/mapController");

const router = express.Router();

// Public/User routes
router.get("/routes/:routeId", authMiddleware, mapController.getRouteMapData);

// Admin routes
router.post("/routes/:routeId/sync", authMiddleware, roleMiddleware("admin"), mapController.syncRouteMapData);

module.exports = router;
