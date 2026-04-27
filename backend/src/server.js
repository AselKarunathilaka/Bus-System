require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = Number(process.env.PORT) || 5000;
let server;
let shuttingDown = false;

const gracefulShutdown = (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`Received ${signal}. Shutting down gracefully...`);

  const finish = async () => {
    try {
      await mongoose.connection.close(false);
      console.log("MongoDB connection closed");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error.message);
    }

    if (signal === "SIGUSR2") {
      process.kill(process.pid, "SIGUSR2");
      return;
    }

    process.exit(0);
  };

  if (!server) {
    finish();
    return;
  }

  server.close((error) => {
    if (error) {
      console.error("Error closing HTTP server:", error.message);
      process.exit(1);
    }
    finish();
  });
};

const startServer = async () => {
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on("error", (error) => {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  });
};

process.once("SIGUSR2", () => gracefulShutdown("SIGUSR2"));
process.once("SIGINT", () => gracefulShutdown("SIGINT"));
process.once("SIGTERM", () => gracefulShutdown("SIGTERM"));

startServer();