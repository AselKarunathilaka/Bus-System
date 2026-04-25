require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// ======================
// CONNECT DATABASE
// ======================
connectDB();

// ======================
// START SERVER
// ======================
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ======================
// HANDLE UNHANDLED PROMISE REJECTIONS
// ======================
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

// ======================
// HANDLE UNCAUGHT EXCEPTIONS (OPTIONAL BUT GOOD)
// ======================
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});