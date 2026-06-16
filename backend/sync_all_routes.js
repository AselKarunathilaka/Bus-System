const mongoose = require("mongoose");
const Route = require("./src/models/Route");
const { computeRouteOverview } = require("./src/services/googleRoutesService");
const dotenv = require("dotenv");

dotenv.config();

async function syncAllRoutes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");
    
    const routes = await Route.find();
    console.log(`Found ${routes.length} routes. Syncing...`);
    
    for (const route of routes) {
      console.log(`Syncing route: ${route.startLocation} to ${route.endLocation}...`);
      try {
        await computeRouteOverview(route._id);
        console.log(`Successfully synced ${route.routeName}`);
      } catch (err) {
        console.error(`Failed to sync ${route.routeName}:`, err.message);
      }
    }
    console.log("All routes synced.");
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    process.exit();
  }
}

syncAllRoutes();
