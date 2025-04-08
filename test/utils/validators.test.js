const {
    registerUserValidator,
    loginUserValidator,
    createEventValidator,
    updateEventValidator,
} = require('../../src/utils/validators');

describe('registerUserValidator', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('should return 400 if name is missing', () => {
        req.body = { email: 'test@example.com', password: 'pass123' };
        registerUserValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Name is required' });
    });

    it('should return 400 if email is missing', () => {
        req.body = { name: 'John', password: 'pass123' };
        registerUserValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email is required' });
    });

    it('should return 400 if password is missing', () => {
        req.body = { name: 'John', email: 'test@example.com' };
        registerUserValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password is required' });
    });

    it('should return 400 if any field is not a string', () => {
        req.body = { name: 'John', email: 123, password: 'pass123' };
        registerUserValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input type' });
    });

    it('should call next() for valid input', () => {
        req.body = { name: 'John', email: 'test@example.com', password: 'pass123' };
        registerUserValidator(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});

describe('loginUserValidator', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('should return 400 if email is missing', () => {
        req.body = { password: 'pass123' };
        loginUserValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email is required' });
    });

    it('should return 400 if password is missing', () => {
        req.body = { email: 'test@example.com' };
        loginUserValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password is required' });
    });

    it('should return 400 if email or password is not a string', () => {
        req.body = { email: 'test@example.com', password: 12345 };
        loginUserValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input type' });
    });

    it('should call next() for valid input', () => {
        req.body = { email: 'test@example.com', password: 'pass123' };
        loginUserValidator(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});

describe('createEventValidator', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('should return 400 if name is missing', () => {
        req.body = { description: 'desc', date: '2099-01-01' };
        createEventValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Name is required' });
    });

    it('should return 400 if description is missing', () => {
        req.body = { name: 'name', date: '2099-01-01' };
        createEventValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Description is required' });
    });

    it('should return 400 if date is missing', () => {
        req.body = { name: 'name', description: 'desc' };
        createEventValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Date is required' });
    });

    it('should return 400 if date is in the past', () => {
        req.body = { name: 'Event', description: 'desc', date: '2000-01-01' };
        createEventValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Date must be in the future' });
    });

    it('should return 400 if any required field is not a string', () => {
        req.body = { name: 'Event', description: {}, date: '2099-01-01' };
        createEventValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input type' });
    });

    it('should call next() for valid input with location', () => {
        req.body = {
            name: 'Event',
            description: 'desc',
            date: '2099-01-01',
            location: 'Hall A',
        };
        createEventValidator(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});

describe('updateEventValidator', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('should return 400 if no fields are provided', () => {
        updateEventValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'At least one field is required' });
    });

    it('should return 400 if name is not a string', () => {
        req.body = { name: 123 };
        updateEventValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input type for name' });
    });

    it('should return 400 if description is not a string', () => {
        req.body = { description: 123 };
        updateEventValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input type for description' });
    });

    it('should return 400 if date is not a string', () => {
        req.body = { date: 123 };
        updateEventValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input type for date' });
    });

    it('should return 400 if location is not a string', () => {
        req.body = { location: 123 };
        updateEventValidator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input type for location' });
    });

    it('should call next() for valid partial update', () => {
        req.body = { description: 'New desc' };
        updateEventValidator(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
