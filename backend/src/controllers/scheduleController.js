const Schedule = require("../models/Schedule");
require("../models/Bus");
require("../models/Route");

const schedulePopulates = [
  { path: "routeId", model: "Route" },
  { path: "busId", model: "Bus" },
];
const ALLOWED_STATUS = ["Scheduled", "In Transit", "Completed", "Cancelled"];

const normalizePayload = (body = {}) => ({
  routeId: body.routeId,
  busId: body.busId,
  departureDate: body.departureDate,
  departureTime: body.departureTime?.trim(),
  status: body.status?.trim() || "Scheduled",
});

const createSchedule = async (req, res) => {
    try {
        const { routeId, busId, departureDate, departureTime, status } =
          normalizePayload(req.body);

        if (!routeId || !busId || !departureDate || !departureTime || !status) {
            return res.status(400).json({
                message: "routeId, busId, departureDate, departureTime and status are required",
            });
        }

        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Allowed values: ${ALLOWED_STATUS.join(", ")}`,
            });
        }
        
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
        const statusCode = error.name === "ValidationError" ? 400 : 500;
        res.status(statusCode).json({ message: error.message });
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
        const payload = normalizePayload(req.body);

        if (!payload.routeId || !payload.busId || !payload.departureDate || !payload.departureTime || !payload.status) {
            return res.status(400).json({
                message: "routeId, busId, departureDate, departureTime and status are required",
            });
        }

        if (!ALLOWED_STATUS.includes(payload.status)) {
            return res.status(400).json({
                message: `Invalid status. Allowed values: ${ALLOWED_STATUS.join(", ")}`,
            });
        }

        const updatedSchedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            payload,
            { new: true, runValidators: true }
        ).populate(schedulePopulates);

        if (!updatedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(updatedSchedule);
    } catch (error) {
        console.error("CRASH DETAILS (updateSchedule):", error);
        const statusCode = error.name === "ValidationError" ? 400 : 500;
        res.status(statusCode).json({ message: error.message });
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