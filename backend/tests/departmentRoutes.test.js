const request = require('supertest');
const { app, server } = require('../index');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

describe('Department Routes', () => {
    const token = jwt.sign({ userId: 1 }, 'test_jwt_secret');

    afterAll(async () => {
        server.close();
    });

    describe('GET /api/departments', () => {
        it('should fetch all departments', async () => {
            pool.query.mockResolvedValueOnce([[{ id: 1, name: 'IT', location: 'Office A' }]]);

            const response = await request(app)
                .get('/api/departments')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ id: 1, name: 'IT', location: 'Office A' }]);
        });
    });

    describe('POST /api/departments', () => {
        it('should create a new department', async () => {
            pool.query.mockResolvedValueOnce([{ insertId: 1 }]);

            const response = await request(app)
                .post('/api/departments')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'HR', location: 'Office B' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'Department created', id: 1 });
            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO Departments (name, location) VALUES (?, ?)',
                ['HR', 'Office B']
            );
        });

        it('should return 400 if name is missing', async () => {
            const response = await request(app)
                .post('/api/departments')
                .set('Authorization', `Bearer ${token}`)
                .send({ location: 'Office B' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Department name is required' });
        });
    });
});