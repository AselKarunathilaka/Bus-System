const Schedule = require("../models/Schedule");
require("../models/Bus");
require("../models/Route");

const schedulePopulates = [
  { path: "routeId", model: "Route" },
  { path: "busId", model: "Bus" },
];

const createSchedule = async (req, res) => {
    try {
        const { routeId, busId, departureDate, departureTime, status } = req.body;
        
        const newSchedule = new Schedule({
            routeId,
            busId,
            departureDate,
            departureTime,
            status
        });

        const savedSchedule = await newSchedule.save();
        res.status(201).json(savedSchedule);
    } catch (error) {
        console.error("CRASH DETAILS (createSchedule):", error);
        res.status(500).json({ message: 'Error creating schedule', error: error.message });
    }
};

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find().populate(schedulePopulates);
        res.status(200).json(schedules);
    } catch (error) {
        console.error("CRASH DETAILS (getAllSchedules):", error);
        res.status(500).json({ message: 'Error fetching schedules', error: error.message });
    }
};

const getScheduleById = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id).populate(
            schedulePopulates
        );
            
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(schedule);
    } catch (error) {
        console.error("CRASH DETAILS (getScheduleById):", error);
        res.status(500).json({ message: 'Error fetching schedule', error: error.message });
    }
};

const updateSchedule = async (req, res) => {
    try {
        const updatedSchedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate(schedulePopulates);

        if (!updatedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(updatedSchedule);
    } catch (error) {
        console.error("CRASH DETAILS (updateSchedule):", error);
        res.status(500).json({ message: 'Error updating schedule', error: error.message });
    }
};

const deleteSchedule = async (req, res) => {
    try {
        const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
        if (!deletedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        console.error("CRASH DETAILS (deleteSchedule):", error);
        res.status(500).json({ message: 'Error deleting schedule', error: error.message });
    }
};

module.exports = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
};