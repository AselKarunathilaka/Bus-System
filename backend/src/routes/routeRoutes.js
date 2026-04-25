const express = require("express");
const router = express.Router();

const routeController = require("../controllers/routeController");
const authMiddleware = require("../middleware/authMiddleware");

// User can test full CRUD after login
router.post("/", authMiddleware, routeController.createRoute);
router.get("/", authMiddleware, routeController.getAllRoutes);
router.get("/:id", authMiddleware, routeController.getRouteById);
router.put("/:id", authMiddleware, routeController.updateRoute);
router.delete("/:id", authMiddleware, routeController.deleteRoute);

module.exports = router;