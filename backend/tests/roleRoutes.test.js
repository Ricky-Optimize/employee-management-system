const request = require('supertest');
const { app, server } = require('../index');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

describe('Role Routes', () => {
    const token = jwt.sign({ userId: 1 }, 'test_jwt_secret');

    afterAll(async () => {
        server.close();
    });

    describe('GET /api/roles', () => {
        it('should fetch all roles', async () => {
            pool.query.mockResolvedValueOnce([[{ id: 1, title: 'Admin', description: 'Administrator role' }]]);

            const response = await request(app)
                .get('/api/roles')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ roles: [{ id: 1, title: 'Admin', description: 'Administrator role' }] });
        });
    });

    describe('POST /api/roles', () => {
        it('should create a new role', async () => {
            pool.query.mockResolvedValueOnce([{ insertId: 1 }]);

            const response = await request(app)
                .post('/api/roles')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Manager', description: 'Management role' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id: 1 });
            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO Roles (title, description) VALUES (?, ?)',
                ['Manager', 'Management role']
            );
        });

        it('should return 400 if title is missing', async () => {
            const response = await request(app)
                .post('/api/roles')
                .set('Authorization', `Bearer ${token}`)
                .send({ description: 'Management role' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Role title is required' });
        });
    });
});