const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

let mongoServer;
let app;

// Mock the model before requiring routes/controllers
// Actually, it's better to implement the model first to avoid issues with mongoose.model already registered
// But for TDD, we can just define the expected behavior.

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Register the model
    require('../models/helpdeskModel');

    // We'll require these after they are implemented
    const routes = require('../routes/helpdeskRoutes');
    routes(app);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Helpdesk API', () => {
    let createdId;

    it('should create a new response', async () => {
        const res = await request(app)
            .post('/responses')
            .send({
                issueCode: 'IT-001',
                response: 'Restart your computer',
                category: 'IT'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        createdId = res.body._id;
    });

    it('should list all responses', async () => {
        const res = await request(app).get('/responses');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should read a single response', async () => {
        const res = await request(app).get(`/responses/${createdId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.issueCode).toEqual('IT-001');
    });

    it('should update a response', async () => {
        const res = await request(app)
            .put(`/responses/${createdId}`)
            .send({
                response: 'Update: Try safe mode'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.response).toEqual('Update: Try safe mode');
    });

    it('should delete a response', async () => {
        const res = await request(app).delete(`/responses/${createdId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Helpdesk response successfully deleted');
    });
});
