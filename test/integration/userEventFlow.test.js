const request = require('supertest');
const app = require('../../src/app');
const { connect, closeDatabase, clearDatabase } = require('../setup/mongoMemory');
const User = require('../../src/models/user');
const Event = require('../../src/models/event');
const bcrypt = require('bcrypt');

describe('Integration Test: Register -> Login -> Fetch Events -> Register for Event', () => {
    let organizerUser;
    let testEvent;

    beforeAll(async () => {
        await connect();

        const hashedPassword = await bcrypt.hash('organizerpass', 10);
        organizerUser = await User.create({
            name: 'Organizer',
            email: 'organizer@example.com',
            password: hashedPassword,
            role: 'organizer'
        });

        testEvent = await Event.create({
            name: 'Node Conference',
            date: new Date(),
            location: 'Online',
            description: 'A test event for node lovers',
            organizer: organizerUser._id
        });
    });

    afterAll(async () => {
        await closeDatabase();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    it('should register, login, fetch events, and register for one', async () => {
        const registerResponse = await request(app)
            .post('/api/v1/users/register')
            .send({
                name: 'testuser',
                email: 'testuser@example.com',
                password: 'testpass'
            })
            .expect(201);

        expect(registerResponse.body).toHaveProperty('user');
        expect(registerResponse.body.user).toHaveProperty('email', 'testuser@example.com');

        const loginResponse = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'testuser@example.com',
                password: 'testpass'
            })
            .expect(200);

        const token = loginResponse.body.token;
        expect(token).toBeTruthy();

        const eventsResponse = await request(app)
            .get('/api/v1/events')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(eventsResponse.body.events).toBeInstanceOf(Array);
        expect(eventsResponse.body.events.length).toBeGreaterThan(0);

        const eventId = eventsResponse.body.events[0]._id;

        const registerEventResponse = await request(app)
            .post(`/api/v1/events/${eventId}/register`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(registerEventResponse.body).toHaveProperty('message', 'User registered for event successfully');
    });
});
