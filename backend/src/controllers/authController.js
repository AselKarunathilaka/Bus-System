const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

<<<<<<< HEAD
// REGISTER
=======
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    if (!fullName || !email || !phone || !password) {
<<<<<<< HEAD
      return res.status(400).json({
        message: "Full name, email, phone, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
=======
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
<<<<<<< HEAD
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
      role: role || "user",
      isActive: true,
=======
      fullName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: role || "user",
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
    });

    const token = createToken(user);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
<<<<<<< HEAD
        _id: user._id,
=======
        id: user._id,
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
<<<<<<< HEAD
        isActive: user.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
};

// LOGIN
=======
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
<<<<<<< HEAD
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        message: "User account is inactive",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
=======
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
<<<<<<< HEAD
        _id: user._id,
=======
        id: user._id,
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
<<<<<<< HEAD
        isActive: user.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to login",
      error: error.message,
    });
  }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
=======
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  }
};