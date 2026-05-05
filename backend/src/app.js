const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const routeRoutes = require("./routes/routeRoutes");
const busRoutes = require("./routes/busRoutes");
const stopRoutes = require("./routes/stopRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/schedules", scheduleRoutes);

module.exports = app;