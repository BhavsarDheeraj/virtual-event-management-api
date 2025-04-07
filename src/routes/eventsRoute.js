const express = require('express');
const router = express.Router();

const {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    registerForEvent
} = require('../controllers/eventsController');

const authMiddleware = require('../middlewares/authMiddleware');
const organizerMiddleware = require('../middlewares/organizerMiddleware');

router.post('/', [authMiddleware, organizerMiddleware], createEvent);
router.get('/', [authMiddleware], getEvents);
router.get('/:id', [authMiddleware], getEvent);
router.patch('/:id', [authMiddleware, organizerMiddleware], updateEvent);
router.delete('/:id', [authMiddleware, organizerMiddleware], deleteEvent);
router.post('/:id/register', [authMiddleware], registerForEvent);

module.exports = router;