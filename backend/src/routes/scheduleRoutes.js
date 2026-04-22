const express = require('express');
const router = express.Router();
const {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
} = require('../controllers/scheduleController');

router.post('/', createSchedule);
router.get('/', getAllSchedules);
router.get('/:id', getScheduleById);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

module.exports = router;