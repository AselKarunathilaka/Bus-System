const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const createRateLimit = require("../middleware/rateLimit");

const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts. Please try again later.",
});

router.post("/register", authRateLimit, authController.register);
router.post("/login", authRateLimit, authController.login);
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
