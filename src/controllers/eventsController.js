const Event = require('../models/event');
const User = require('../models/user');

const createEvent = async (req, res) => {
    const { name, description, date, location } = req.body;
    const { id: userId } = req.user;

    const organizer = await User.findById(userId);
    if (!organizer) {
        return res.status(400).json({
            message: 'Organizer not found',
        });
    }

    const newEvent = new Event({
        name,
        description,
        date,
        location,
        organizer: userId,
    });

    try {
        await newEvent.save();
        return res.status(201).json({
            message: 'Event created successfully',
            event: {
                ...newEvent._doc,
                organizer: {
                    _id: organizer._id,
                    name: organizer.name,
                    email: organizer.email,
                },
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error creating event',
            error: error.message,
        });
    }

};

const getEvents = async (req, res) => {
    try {
        const events = await Event
            .find()
            .populate('organizer', 'name email')
            .populate('participants', 'name email');
        return res.status(200).json({
            message: 'Events fetched successfully',
            events,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching events',
            error: error.message,
        });
    }
};


const getEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event
            .findById(id)
            .populate('organizer', 'name email')
            .populate('participants', 'name email');

        if (!event) {
            return res.status(404).json({
                message: 'Event not found',
            });
        }

        return res.status(200).json({
            message: 'Event fetched successfully',
            event,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching event',
            error: error.message,
        });
    }
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { name, description, date, location } = req.body;

    try {
        const event = await Event.findByIdAndUpdate(
            id,
            { name, description, date, location },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({
                message: 'Event not found',
            });
        }

        return res.status(200).json({
            message: 'Event updated successfully',
            event,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating event',
            error: error.message,
        });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found',
            });
        }

        return res.status(200).json({
            message: 'Event deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting event',
            error: error.message,
        });
    }
};

const registerForEvent = async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.user;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({
                message: 'Event not found',
            });
        }
        if (event.participants.includes(userId)) {
            return res.status(400).json({
                message: 'User already registered for this event',
            });
        }

        event.participants.push(userId);
        await event.save();

        // TODO: Send email to the user for registration confirmation

        return res.status(200).json({
            message: 'User registered for event successfully',
            event,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error registering for event',
            error: error.message,
        });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
}