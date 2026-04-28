const express = require("express");
const router = express.Router();
const { getAllBuses } = require("../controllers/busController");

router.get("/", getAllBuses);

module.exports = router;
