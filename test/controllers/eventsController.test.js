const { createEvent, getEvents, getEvent, updateEvent, deleteEvent, registerForEvent } = require('../../src/controllers/eventsController');
const Event = require('../../src/models/event');
const User = require('../../src/models/user');

jest.mock('../../src/utils/mailer', () => ({
    sendRegistrationSuccessMail: jest.fn(),
}));


jest.mock('../../src/models/event');
jest.mock('../../src/models/user');

const { sendRegistrationSuccessMail } = require('../../src/utils/mailer');


const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('eventsController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Event.mockReset();
    });

    describe('createEvent', () => {

        it('should create event successfully', async () => {
            const req = {
                body: {
                    name: "Event 1",
                    description: "Description of event 1",
                    date: "2025-04-10T11:44:01+00:00",
                    location: "Bangalore, India"
                },
                user: { id: "123" }
            };
            const res = mockResponse();

            const userMock = { _id: '123', name: 'Organizer name', email: 'user@example.com' };
            User.findById.mockResolvedValue(userMock);

            const eventMock = {
                save: jest.fn().mockResolvedValue(true),
                toObject: jest.fn().mockReturnValue({
                    name: "Event 1",
                    description: "Description of event 1",
                    date: "2025-04-10T11:44:01+00:00",
                    location: "Bangalore, India"
                }),
            };
            Event.mockImplementation(() => eventMock);

            await createEvent(req, res);

            expect(User.findById).toHaveBeenCalledWith('123');
            expect(Event).toHaveBeenCalledWith({
                name: "Event 1",
                description: "Description of event 1",
                date: "2025-04-10T11:44:01+00:00",
                location: "Bangalore, India",
                organizer: "123"
            });
            expect(eventMock.save).toHaveBeenCalled();
            expect(eventMock.toObject).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Event created successfully',
                event: {
                    name: "Event 1",
                    description: "Description of event 1",
                    date: "2025-04-10T11:44:01+00:00",
                    location: "Bangalore, India",
                    organizer: userMock
                }
            });
        });

        it('should return 400 if organizer not found', async () => {
            const req = {
                body: {
                    name: "Event 1",
                    description: "Description of event 1",
                    date: "2025-04-10T11:44:01+00:00",
                    location: "Bangalore, India"
                },
                user: { id: "123" }
            };
            const res = mockResponse();

            User.findById.mockResolvedValue(null);

            await createEvent(req, res);

            expect(User.findById).toHaveBeenCalledWith('123');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Organizer not found' });
        });

        it('should return 500 if event creation fails', async () => {
            const req = {
                body: {
                    name: "Event 1",
                    description: "Description of event 1",
                    date: "2025-04-10T11:44:01+00:00",
                    location: "Bangalore, India"
                },
                user: { id: "123" }
            };
            const res = mockResponse();

            User.findById.mockResolvedValue({ _id: '123', name: 'Organizer', email: 'x@x.com' });

            Event.mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(new Error('save error')),
            }));

            await createEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error creating event',
                error: 'save error',
            });
        });
    });

    describe('getEvents', () => {
        it('should fetch and return events', async () => {
            const mockEvents = [{ name: 'E1' }, { name: 'E2' }];

            const query = {
                populate: jest.fn().mockReturnThis(),
                then: onFulfilled => Promise.resolve(onFulfilled(mockEvents)),
            };
            Event.find.mockReturnValue(query);

            const res = mockResponse();
            await getEvents({}, res);

            expect(Event.find).toHaveBeenCalled();
            expect(query.populate).toHaveBeenCalledWith('organizer', 'name email');
            expect(query.populate).toHaveBeenCalledWith('participants', 'name email');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Events fetched successfully',
                events: mockEvents,
            });
        });

        it('should handle errors', async () => {
            Event.find.mockImplementation(() => { throw new Error('fail'); });
            const res = mockResponse();
            await getEvents({}, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error fetching events',
                error: 'fail',
            });
        });
    });

    describe('getEvent', () => {
        const fakeReq = { params: { id: 'evt123' } };

        it('should return single event when found', async () => {
            const mockEvent = { name: 'MyEvent' };
            const query = {
                populate: jest.fn().mockReturnThis(),
                then: onFulfilled => Promise.resolve(onFulfilled(mockEvent)),
            };
            Event.findById.mockReturnValue(query);

            const res = mockResponse();
            await getEvent(fakeReq, res);

            expect(Event.findById).toHaveBeenCalledWith('evt123');
            expect(query.populate).toHaveBeenCalledWith('organizer', 'name email');
            expect(query.populate).toHaveBeenCalledWith('participants', 'name email');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Event fetched successfully',
                event: mockEvent,
            });
        });

        it('should 404 if not found', async () => {
            const query = {
                populate: jest.fn().mockReturnThis(),
                then: onFulfilled => Promise.resolve(onFulfilled(null)),
            };
            Event.findById.mockReturnValue(query);

            const res = mockResponse();
            await getEvent(fakeReq, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
        });

        it('should handle errors', async () => {
            Event.findById.mockImplementation(() => { throw new Error('oops'); });
            const res = mockResponse();
            await getEvent(fakeReq, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error fetching event',
                error: 'oops',
            });
        });
    });

    describe('updateEvent', () => {
        const fakeReq = {
            params: { id: 'evt123' },
            body: { name: 'NewName', description: 'D', date: '2025-01-01', location: 'X' },
        };

        it('should update and return event when found', async () => {
            const updated = { ...fakeReq.body, _id: 'evt123' };
            Event.findByIdAndUpdate.mockResolvedValue(updated);

            const res = mockResponse();
            await updateEvent(fakeReq, res);

            expect(Event.findByIdAndUpdate).toHaveBeenCalledWith(
                'evt123',
                fakeReq.body,
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Event updated successfully',
                event: updated,
            });
        });

        it('should 404 if not found', async () => {
            Event.findByIdAndUpdate.mockResolvedValue(null);
            const res = mockResponse();
            await updateEvent(fakeReq, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
        });

        it('should handle errors', async () => {
            Event.findByIdAndUpdate.mockRejectedValue(new Error('bad'));
            const res = mockResponse();
            await updateEvent(fakeReq, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error updating event',
                error: 'bad',
            });
        });
    });

    describe('deleteEvent', () => {
        const fakeReq = { params: { id: 'evt123' } };

        it('should delete and return success', async () => {
            Event.findByIdAndDelete.mockResolvedValue({ _id: 'evt123' });
            const res = mockResponse();
            await deleteEvent(fakeReq, res);

            expect(Event.findByIdAndDelete).toHaveBeenCalledWith('evt123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Event deleted successfully',
            });
        });

        it('should 404 if not found', async () => {
            Event.findByIdAndDelete.mockResolvedValue(null);
            const res = mockResponse();
            await deleteEvent(fakeReq, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
        });

        it('should handle errors', async () => {
            Event.findByIdAndDelete.mockRejectedValue(new Error('boom'));
            const res = mockResponse();
            await deleteEvent(fakeReq, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error deleting event',
                error: 'boom',
            });
        });
    });

    describe('registerForEvent', () => {
        const fakeReq = { params: { id: 'evt123' }, user: { id: 'user1' } };

        it('should register a user when not already registered', async () => {
            const userMock = { _id: 'user1', email: 'u@example.com' };
            const eventMock = {
                participants: [],
                save: jest.fn().mockResolvedValue(true),
            };

            Event.findById.mockResolvedValue(eventMock);
            User.findById.mockResolvedValue(userMock);

            const res = mockResponse();
            await registerForEvent(fakeReq, res);

            expect(Event.findById).toHaveBeenCalledWith('evt123');
            expect(User.findById).toHaveBeenCalledWith('user1');
            expect(eventMock.participants).toContain('user1');
            expect(eventMock.save).toHaveBeenCalled();

            expect(sendRegistrationSuccessMail).toHaveBeenCalledWith('u@example.com', eventMock);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User registered for event successfully',
                event: eventMock,
            });
        });

        it('should 400 if already registered', async () => {
            const eventMock = { participants: ['user1'] };
            Event.findById.mockResolvedValue(eventMock);

            const res = mockResponse();
            await registerForEvent(fakeReq, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User already registered for this event',
            });
        });

        it('should 404 if event not found', async () => {
            Event.findById.mockResolvedValue(null);

            const res = mockResponse();
            await registerForEvent(fakeReq, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
        });

        it('should 404 if user not found', async () => {
            const eventMock = { participants: [], save: jest.fn() };
            Event.findById.mockResolvedValue(eventMock);
            User.findById.mockResolvedValue(null);

            const res = mockResponse();
            await registerForEvent(fakeReq, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should handle errors', async () => {
            Event.findById.mockRejectedValue(new Error('uh oh'));

            const res = mockResponse();
            await registerForEvent(fakeReq, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error registering for event',
                error: 'uh oh',
            });
        });
    });

});