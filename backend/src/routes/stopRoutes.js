const express = require("express");
const router = express.Router();

const stopController = require("../controllers/stopController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("admin"), stopController.createStop);
router.get("/route/:routeId", authMiddleware, stopController.getStopsByRoute);
router.get("/:id", authMiddleware, stopController.getStopById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), stopController.updateStop);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), stopController.deleteStop);

module.exports = router;