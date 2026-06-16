const mongoose = require("mongoose");
const Route = require("./src/models/Route");
const dotenv = require("dotenv");

dotenv.config();

async function fixMap() {
  await mongoose.connect(process.env.MONGODB_URI);
  const route = await Route.findOne({ startLocation: "Colombo", endLocation: "Kandy" });
  if (route) {
    route.startCoordinates = { lat: 6.9271, lng: 79.8612 };
    route.endCoordinates = { lat: 7.2906, lng: 80.6337 };
    route.routeDistanceMeters = 115000;
    route.routeDurationSeconds = 14400;
    route.routePolyline = "y~f|@w`p|L~FfB_E_B_@";
    await route.save();
    console.log("Fixed Colombo - Kandy route map data.");
  } else {
    console.log("Route not found");
  }
  process.exit();
}
fixMap();
