const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const userController = require("../controllers/userController");

router.get("/", authMiddleware, roleMiddleware("admin"), userController.getAllUsers);
router.post("/", authMiddleware, roleMiddleware("admin"), userController.createUser);
router.get(
  "/analytics",
  authMiddleware,
  roleMiddleware("admin"),
  userController.getUserAnalytics
);
router.get("/:id", authMiddleware, userController.getUserById);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), userController.deleteUser);

module.exports = router;