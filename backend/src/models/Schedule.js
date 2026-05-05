const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  routeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Route', 
    required: true 
  },
  busId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bus', 
    required: true 
  },
  departureDate: { 
    type: Date, 
    required: true 
  },
  departureTime: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Scheduled", "In Transit", "Completed", "Cancelled"], 
    default: 'Scheduled' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);