const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const routeRoutes = require("./routes/routeRoutes");
const stopRoutes = require("./routes/stopRoutes");
const busRoutes = require("./routes/busRoutes");

const app = express();

// ======================
// MIDDLEWARES
// ======================
app.use(cors());
app.use(express.json());

// ======================
// TEST ROUTES
// ======================
app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.get("/api", (req, res) => {
  res.json({ message: "API is working" });
});

// ======================
// API ROUTES
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/buses", busRoutes);

// ======================
// 404 HANDLER
// ======================
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.originalUrl,
  });
});

module.exports = app;