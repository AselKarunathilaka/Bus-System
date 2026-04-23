const express = require("express");
const router = express.Router();

const routeController = require("../controllers/routeController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("admin"), routeController.createRoute);
router.get("/", authMiddleware, routeController.getAllRoutes);
router.get("/:id", authMiddleware, routeController.getRouteById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), routeController.updateRoute);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), routeController.deleteRoute);

module.exports = router;