const mongoose = require("mongoose");
const Stop = require("./src/models/Stop");
const dotenv = require("dotenv");

dotenv.config();

async function fixStops() {
  await mongoose.connect(process.env.MONGODB_URI);
  const stops = await Stop.find({});
  for (let s of stops) {
    if (s.stopName === 'Kadawatha') s.coordinates = { lat: 7.0011, lng: 79.9500 };
    if (s.stopName === 'Kegalle') s.coordinates = { lat: 7.2513, lng: 80.3464 };
    if (s.stopName === 'Peradeniya') s.coordinates = { lat: 7.2681, lng: 80.5938 };
    if (s.stopName === 'Nittambuwa') s.coordinates = { lat: 7.1436, lng: 80.0961 };
    
    // Add default coordinates if missing just to show something
    if (!s.coordinates || !s.coordinates.lat) {
      // Random coordinates between Colombo and Kandy just to visualize
      s.coordinates = { 
        lat: 6.9271 + (Math.random() * 0.3), 
        lng: 79.8612 + (Math.random() * 0.5) 
      };
    }
    await s.save();
  }
  console.log('Updated stops', stops.length);
  process.exit(0);
}

fixStops();
