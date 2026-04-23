const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
<<<<<<< HEAD
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
=======
    return res.status(401).json({ message: "Unauthorized" });
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  }
};