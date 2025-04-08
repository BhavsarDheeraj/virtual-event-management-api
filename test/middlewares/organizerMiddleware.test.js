const organizerMiddleware = require('../../src/middlewares/organizerMiddleware');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('organizerMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { user: {} };
        res = mockResponse();
        next = jest.fn();
    });

    it('should forbid when role is not organizer', () => {
        req.user.role = 'attendee';

        organizerMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next when role is organizer', () => {
        req.user.role = 'organizer';

        organizerMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should forbid when user object missing or role undefined', () => {
        organizerMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
        expect(next).not.toHaveBeenCalled();
    });
});
