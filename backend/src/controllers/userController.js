const bcrypt = require("bcryptjs");
const User = require("../models/User");

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

    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== requestedUserId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updates = { ...req.body };

    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    if (updates.password) {
      if (updates.password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    if (req.user.role !== "admin") {
      delete updates.role;
      delete updates.isActive;
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

    const user = await User.findByIdAndDelete(requestedUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};