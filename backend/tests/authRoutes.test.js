const request = require('supertest');
const { app, server } = require('../index');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Auth Routes', () => {
    afterAll(async () => {
        server.close(); // Close the server after all tests
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            pool.query.mockResolvedValueOnce([{ insertId: 1 }]);
            bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');

            const response = await request(app)
                .post('/api/auth/register')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'User registered' });
            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO Users (email, password) VALUES (?, ?)',
                ['test@example.com', 'hashed_password']
            );
        });

        it('should return 400 if email or password is missing', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Email and password are required' });
        });

        it('should handle duplicate email error', async () => {
            pool.query.mockRejectedValueOnce({ code: 'ER_DUP_ENTRY' });

            const response = await request(app)
                .post('/api/auth/register')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Email already exists' });
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login a user and return a token', async () => {
            pool.query.mockResolvedValueOnce([[{ id: 1, email: 'test@example.com', password: 'hashed_password' }]]);
            bcrypt.compare = jest.fn().mockResolvedValue(true);
            jwt.sign = jest.fn().mockReturnValue('mocked_token');

            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ token: 'mocked_token' });
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: 1 },
                'test_jwt_secret',
                { expiresIn: '1h' }
            );
        });

        it('should return 401 for invalid credentials', async () => {
            pool.query.mockResolvedValueOnce([[]]);

            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'wrong_password' });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Invalid credentials' });
        });
    });
});