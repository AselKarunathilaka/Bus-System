const express = require("express");
const router = express.Router();

// controllers
const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

// middleware
const authMiddleware = require("../middleware/authMiddleware");

// ==========================
// AUTH ROUTES
// ==========================

// Register new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get logged-in user profile
router.get("/me", authMiddleware, getMe);

module.exports = router;