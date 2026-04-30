const bcrypt = require("bcryptjs");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, role, isActive } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role,
      isActive,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        registeredAt: user.registeredAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
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

const updateUser = async (req, res) => {
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

const deleteUser = async (req, res) => {
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

const getUserAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const analytics = await User.aggregate([
      {
        $facet: {
          totalUsers: [{ $count: "count" }],
          usersByRole: [
            {
              $group: {
                _id: "$role",
                count: { $sum: 1 },
              },
            },
          ],
          newUsersLast30Days: [
            {
              $match: {
                registeredAt: { $gte: thirtyDaysAgo },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const data = analytics[0] || {};
    const roleCounts = (data.usersByRole || []).reduce(
      (acc, item) => {
        acc[item._id] = item.count;
        return acc;
      },
      { admin: 0, passenger: 0 }
    );

    return res.status(200).json({
      totalUsers: data.totalUsers?.[0]?.count || 0,
      usersByRole: roleCounts,
      newUsersLast30Days: data.newUsersLast30Days?.[0]?.count || 0,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserAnalytics,
};