const Schedule = require('../models/Schedule');

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
        res.status(500).json({ message: 'Error creating schedule', error: error.message });
    }
};

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find()
            .populate('routeId')
            .populate('busId');
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error: error.message });
    }
};

const getScheduleById = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id)
            .populate('routeId')
            .populate('busId');
            
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedule', error: error.message });
    }
};

const updateSchedule = async (req, res) => {
    try {
        const updatedSchedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        .populate('routeId')
        .populate('busId');

        if (!updatedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(updatedSchedule);
    } catch (error) {
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