const express = require('express')
const request = require('supertest')

jest.mock('../../src/controllers/usersController', () => ({
    registerUser: (req, res) => res.status(200).send('registerUser'),
    loginUser: (req, res) => res.status(200).send('loginUser'),
}))
jest.mock('../../src/utils/validators', () => ({
    registerUserValidator: (req, res, next) => next(),
    loginUserValidator: (req, res, next) => next(),
}))

const usersRouter = require('../../src/routes/usersRoute')

describe('usersRoute', () => {
    let app
    beforeAll(() => {
        app = express()
        app.use(express.json())
        app.use('/api/v1/users', usersRouter)
    })

    it('POST /api/v1/users/register → registerUser', async () => {
        const res = await request(app).post('/api/v1/users/register').send({})
        expect(res.status).toBe(200)
        expect(res.text).toBe('registerUser')
    })

    it('POST /api/v1/users/login → loginUser', async () => {
        const res = await request(app).post('/api/v1/users/login').send({})
        expect(res.status).toBe(200)
        expect(res.text).toBe('loginUser')
    })
})
