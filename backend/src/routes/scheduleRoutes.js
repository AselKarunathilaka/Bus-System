const express = require("express");
const router = express.Router();

const scheduleController = require("../controllers/scheduleController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("admin"), scheduleController.createSchedule);
router.get("/", authMiddleware, scheduleController.getAllSchedules);
router.get("/:id", authMiddleware, scheduleController.getScheduleById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), scheduleController.updateSchedule);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), scheduleController.deleteSchedule);

module.exports = router;
