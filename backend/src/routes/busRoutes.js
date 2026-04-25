const express = require("express");

const {
  createBus,
  getAllBuses,
  getAvailableBuses,
  getBusById,
  updateBus,
  deleteBus,
} = require("../controllers/busController");

const router = express.Router();

// Create bus
router.post("/", createBus);

// Get all buses
router.get("/", getAllBuses);

// Get available buses
router.get("/available/list", getAvailableBuses);

// Get single bus by ID
router.get("/:id", getBusById);

// Update bus
router.put("/:id", updateBus);

// Delete bus
router.delete("/:id", deleteBus);

module.exports = router;