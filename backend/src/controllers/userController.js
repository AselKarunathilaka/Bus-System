const bcrypt = require("bcryptjs");
const User = require("../models/User");
const mongoose = require("mongoose");
const {
  cleanText,
  isValidEmail,
  isValidPhone,
  isStrongEnoughPassword,
} = require("../utils/validation");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const requestedUserId = req.params.id;

    if (!isValidObjectId(requestedUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== requestedUserId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(requestedUserId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const requestedUserId = req.params.id;

    if (!isValidObjectId(requestedUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== requestedUserId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updates = {};

    if (req.body.fullName !== undefined) {
      updates.fullName = cleanText(req.body.fullName, 100);
      if (!updates.fullName) {
        return res.status(400).json({ message: "Full name cannot be empty" });
      }
    }

    if (req.body.phone !== undefined) {
      updates.phone = cleanText(req.body.phone, 20);
      if (!isValidPhone(updates.phone)) {
        return res.status(400).json({ message: "A valid phone number is required" });
      }
    }

    if (req.body.email !== undefined) {
      updates.email = cleanText(req.body.email, 254).toLowerCase();
      if (!isValidEmail(updates.email)) {
        return res.status(400).json({ message: "A valid email address is required" });
      }
    }

    if (req.body.password) {
      if (!isStrongEnoughPassword(req.body.password)) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters and include a letter and number" });
      }
      updates.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.user.role === "admin") {
      if (
        req.body.role !== undefined &&
        !["user", "admin"].includes(req.body.role)
      ) {
        return res.status(400).json({ message: "Invalid user role" });
      }
      if (req.body.role !== undefined) updates.role = req.body.role;
      if (req.body.isActive !== undefined) updates.isActive = Boolean(req.body.isActive);
    }

    const user = await User.findByIdAndUpdate(requestedUserId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const requestedUserId = req.params.id;

    if (!isValidObjectId(requestedUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (requestedUserId === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot deactivate your own admin account" });
    }

    const user = await User.findByIdAndUpdate(
      requestedUserId,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User deactivated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
