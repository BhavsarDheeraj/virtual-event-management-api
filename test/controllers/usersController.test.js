const { registerUser, loginUser } = require('../../src/controllers/usersController');
const User = require('../../src/models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/user');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('usersController', () => {
    beforeEach(() => jest.clearAllMocks());


    describe('registerUser', () => {

        it('should register user successfully', async () => {
            const req = {
                body: { name: 'Test', email: 'test@example.com', password: 'password123', role: 'user' }
            };
            const res = mockResponse();

            User.exists.mockResolvedValue(false);
            bcrypt.hash.mockResolvedValue('hashedPassword');

            const userMock = {
                save: jest.fn().mockResolvedValue(true),
                toObject: jest.fn().mockReturnValue({
                    name: 'Test',
                    email: 'test@example.com',
                    role: 'user',
                }),
            };
            User.mockImplementation(() => userMock);

            await registerUser(req, res);

            expect(User.exists).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(userMock.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User registered successfully! Please login to continue.',
                user: {
                    name: 'Test',
                    email: 'test@example.com',
                    role: 'user',
                },
            });
        });

        it('should return 400 if user exists', async () => {
            const req = { body: { email: 'exists@example.com' } };
            const res = mockResponse();

            User.exists.mockResolvedValue(true);

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: expect.stringContaining('already exists'),
            });
        });

        it('should return 500 if hashing fails', async () => {
            const req = {
                body: { name: 'Test', email: 'test@example.com', password: 'password123', role: 'user' }
            };
            const res = mockResponse();

            User.exists.mockResolvedValue(false);
            bcrypt.hash.mockResolvedValue(null);

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Something went wrong!',
            });
        });

        it('should return 500 if save fails', async () => {
            const req = {
                body: { name: 'Test', email: 'test@example.com', password: 'password123', role: 'user' }
            };
            const res = mockResponse();

            User.exists.mockResolvedValue(false);
            bcrypt.hash.mockResolvedValue('hashedPassword');

            const userMock = {
                save: jest.fn().mockRejectedValue(new Error('save failed')),
                toObject: jest.fn().mockReturnValue({
                    name: 'Test',
                    email: 'test@example.com',
                    role: 'user',
                }),
            };
            User.mockImplementation(() => userMock);

            await registerUser(req, res);

            expect(userMock.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error registering user',
                error: 'save failed',
            });
        });
    });

    describe('loginUser', () => {

        it('should login successfully', async () => {
            const req = {
                body: { email: 'user@example.com', password: 'plainpassword' }
            };
            const res = mockResponse();

            const userMock = {
                _id: '123',
                email: 'user@example.com',
                password: 'hashedpassword',
                role: 'organizer',
                toObject: jest.fn().mockReturnValue({
                    _id: '123',
                    email: 'user@example.com',
                    role: 'organizer',
                }),
            };
            User.findOne.mockResolvedValue(userMock);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockedToken');

            await loginUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'user@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('plainpassword', 'hashedpassword');
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: '123', role: 'organizer' },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            expect(userMock.toObject).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Login successful',
                user: {
                    _id: '123',
                    email: 'user@example.com',
                    role: 'organizer',
                },
                token: 'mockedToken',
            });
        });

        it('should return 401 if user not found', async () => {
            const req = { body: { email: 'nouser@example.com', password: 'pass' } };
            const res = mockResponse();

            User.findOne.mockResolvedValue(null);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid email or password',
            });
        });

        it('should return 401 if password invalid', async () => {
            const req = { body: { email: 'user@example.com', password: 'wrong' } };
            const res = mockResponse();

            User.findOne.mockResolvedValue({
                password: 'hashed',
                toObject: jest.fn().mockReturnValue({ password: 'hashed' }),
            });
            bcrypt.compare.mockResolvedValue(false);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid email or password',
            });
        });
    });

});