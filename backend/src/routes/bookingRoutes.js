const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, bookingController.createBooking);
router.get("/my", authMiddleware, bookingController.getMyBookings);
router.get("/", authMiddleware, roleMiddleware("admin"), bookingController.getAllBookings);
router.delete("/:id", authMiddleware, bookingController.cancelBooking);
router.delete("/admin/:id", authMiddleware, roleMiddleware("admin"), bookingController.deleteBooking);

module.exports = router;
