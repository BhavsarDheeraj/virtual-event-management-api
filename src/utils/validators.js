const registerUserValidator = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name) {
        return res.status(400).json({
            message: 'Name is required',
        });
    }
    if (!email) {
        return res.status(400).json({
            message: 'Email is required',
        });
    }
    if (!password) {
        return res.status(400).json({
            message: 'Password is required',
        });
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
            message: 'Invalid input type',
        });
    }

    next();
}

const loginUserValidator = (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({
            message: 'Email is required',
        });
    }
    if (!password) {
        return res.status(400).json({
            message: 'Password is required',
        });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
            message: 'Invalid input type',
        });
    }

    next();
}

const createEventValidator = (req, res, next) => {
    const { name, description, date, location } = req.body;

    if (!name) {
        return res.status(400).json({
            message: 'Name is required',
        });
    }
    if (!description) {
        return res.status(400).json({
            message: 'Description is required',
        });
    }
    if (!date) {
        return res.status(400).json({
            message: 'Date is required',
        });
    }

    if (typeof name !== 'string' || typeof description !== 'string' || typeof date !== 'string' || (location && typeof location !== 'string')) {
        return res.status(400).json({
            message: 'Invalid input type',
        });
    }

    if (new Date(date) < new Date()) {
        return res.status(400).json({
            message: 'Date must be in the future',
        });
    }

    next();
}

const updateEventValidator = (req, res, next) => {
    const { name, description, date, location } = req.body;

    if (!name && !description && !date && !location) {
        return res.status(400).json({
            message: 'At least one field is required',
        });
    }

    if (name && typeof name !== 'string') {
        return res.status(400).json({
            message: 'Invalid input type for name',
        });
    }
    if (description && typeof description !== 'string') {
        return res.status(400).json({
            message: 'Invalid input type for description',
        });
    }
    if (date && typeof date !== 'string') {
        return res.status(400).json({
            message: 'Invalid input type for date',
        });
    }
    if (location && typeof location !== 'string') {
        return res.status(400).json({
            message: 'Invalid input type for location',
        });
    }

    next();
}



module.exports = {
    registerUserValidator,
    loginUserValidator,
    createEventValidator,
    updateEventValidator,
};