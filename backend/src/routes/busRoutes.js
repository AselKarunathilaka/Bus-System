const express = require("express");
const router = express.Router();

const busController = require("../controllers/busController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ======================
// CREATE BUS (Admin only)
// ======================
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  busController.createBus
);

// ======================
// GET ALL BUSES
// ======================
router.get(
  "/",
  authMiddleware,
  busController.getAllBuses
);

// ======================
// GET AVAILABLE BUSES
// ======================
router.get(
  "/available/list",
  authMiddleware,
  busController.getAvailableBuses
);

// ======================
// GET BUS BY ID
// ======================
router.get(
  "/:id",
  authMiddleware,
  busController.getBusById
);

// ======================
// UPDATE BUS (Admin only)
// ======================
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  busController.updateBus
);

// ======================
// DELETE BUS (Admin only)
// ======================
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  busController.deleteBus
);

module.exports = router;