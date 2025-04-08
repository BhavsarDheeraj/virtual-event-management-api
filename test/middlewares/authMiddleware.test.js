process.env.JWT_SECRET = 'test-secret';

const authMiddleware = require('../../src/middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('authMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { headers: {} };
        res = mockResponse();
        next = jest.fn();
    });

    it('should return 401 if no Authorization header', () => {
        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if header present but no token part', () => {
        req.headers.authorization = 'Bearer';
        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', () => {
        req.headers.authorization = 'Bearer badtoken';
        jwt.verify.mockImplementation((token, secret, cb) => {
            cb(new Error('invalid'), null);
        });

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            'badtoken',
            process.env.JWT_SECRET,
            expect.any(Function)
        );
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next and set req.user on valid token', () => {
        req.headers.authorization = 'Bearer goodtoken';
        const decoded = { id: 'u1', role: 'admin' };

        jwt.verify.mockImplementation((token, secret, cb) => {
            cb(null, decoded);
        });

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            'goodtoken',
            process.env.JWT_SECRET,
            expect.any(Function)
        );
        expect(req.user).toEqual(decoded);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});
