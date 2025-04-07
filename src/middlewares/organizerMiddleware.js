const organizerMiddleware = (req, res, next) => {
    const { role } = req.user;

    if (role !== 'organizer') {
        return res.status(403).json({
            message: 'Forbidden',
        });
    }

    next();
}
module.exports = organizerMiddleware;