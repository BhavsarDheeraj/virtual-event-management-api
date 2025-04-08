const express = require('express');
const request = require('supertest');

jest.mock('../../src/controllers/eventsController', () => ({
    createEvent: (req, res) => res.status(200).send('createEvent'),
    getEvents: (req, res) => res.status(200).send('getEvents'),
    getEvent: (req, res) => res.status(200).send('getEvent'),
    updateEvent: (req, res) => res.status(200).send('updateEvent'),
    deleteEvent: (req, res) => res.status(200).send('deleteEvent'),
    registerForEvent: (req, res) => res.status(200).send('registerForEvent'),
}));

jest.mock('../../src/middlewares/authMiddleware', () => (req, res, next) => next());
jest.mock('../../src/middlewares/organizerMiddleware', () => (req, res, next) => next());

jest.mock('../../src/utils/validators', () => ({
    createEventValidator: (req, res, next) => next(),
    updateEventValidator: (req, res, next) => next(),
}));

const eventsRouter = require('../../src/routes/eventsRoute');

describe('eventsRoute', () => {
    let app;
    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api/v1/events', eventsRouter);
    });

    it('POST   /api/v1/events            → createEvent', async () => {
        const res = await request(app).post('/api/v1/events').send({});
        expect(res.status).toBe(200);
        expect(res.text).toBe('createEvent');
    });

    it('GET    /api/v1/events            → getEvents', async () => {
        const res = await request(app).get('/api/v1/events');
        expect(res.status).toBe(200);
        expect(res.text).toBe('getEvents');
    });

    it('GET    /api/v1/events/:id        → getEvent', async () => {
        const res = await request(app).get('/api/v1/events/xyz');
        expect(res.status).toBe(200);
        expect(res.text).toBe('getEvent');
    });

    it('PATCH  /api/v1/events/:id        → updateEvent', async () => {
        const res = await request(app).patch('/api/v1/events/xyz').send({});
        expect(res.status).toBe(200);
        expect(res.text).toBe('updateEvent');
    });

    it('DELETE /api/v1/events/:id        → deleteEvent', async () => {
        const res = await request(app).delete('/api/v1/events/xyz');
        expect(res.status).toBe(200);
        expect(res.text).toBe('deleteEvent');
    });

    it('POST   /api/v1/events/:id/register → registerForEvent', async () => {
        const res = await request(app).post('/api/v1/events/xyz/register');
        expect(res.status).toBe(200);
        expect(res.text).toBe('registerForEvent');
    });
});
