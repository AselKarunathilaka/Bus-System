const express = require("express");
const router = express.Router();

const busController = require("../controllers/busController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("admin"), busController.createBus);

router.get("/", authMiddleware, busController.getAllBuses);
router.get("/available/list", authMiddleware, busController.getAvailableBuses);
router.get("/route/:routeId", authMiddleware, busController.getBusesByRoute);
router.get("/:id", authMiddleware, busController.getBusById);

router.put("/:id", authMiddleware, roleMiddleware("admin"), busController.updateBus);
router.put("/:id/assign-route", authMiddleware, roleMiddleware("admin"), busController.assignBusToRoute);
router.put("/:id/remove-route", authMiddleware, roleMiddleware("admin"), busController.removeBusFromRoute);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), busController.deleteBus);

module.exports = router;