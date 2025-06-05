const request = require('supertest');
const { app, server } = require('../index');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

describe('Employee Routes', () => {
    const token = jwt.sign({ userId: 1 }, 'test_jwt_secret');

    afterAll(async () => {
        server.close();
    });

    describe('GET /api/employees', () => {
        it('should fetch employees with pagination and search', async () => {
            // Mock the three queries in order
            pool.query
                .mockResolvedValueOnce([
                    [
                        {
                            id: 1,
                            first_name: 'John',
                            last_name: 'Doe',
                            email: 'john@example.com',
                            position: 'Developer',
                            salary: 50000,
                            department_id: 1,
                            department_name: 'IT'
                        }
                    ]
                ]) // Employee query
                .mockResolvedValueOnce([[{ id: 1, title: 'Admin' }]]) // Roles query
                .mockResolvedValueOnce([[{ count: 1 }]]); // Total count query

            const response = await request(app)
                .get('/api/employees?page=1&limit=10&search=John')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                employees: [
                    {
                        id: 1,
                        first_name: 'John',
                        last_name: 'Doe',
                        email: 'john@example.com',
                        position: 'Developer',
                        salary: 50000,
                        department_id: 1,
                        department_name: 'IT',
                        roles: [{ id: 1, title: 'Admin' }]
                    }
                ],
                total: 1
            });
            expect(pool.query).toHaveBeenCalledTimes(3);
            expect(pool.query).toHaveBeenNthCalledWith(
                1,
                expect.stringContaining('SELECT e.id, e.first_name'),
                ['%John%', '%John%', '%John%', '%John%', 10, 0]
            );
            expect(pool.query).toHaveBeenNthCalledWith(
                2,
                expect.stringContaining('SELECT r.id, r.title'),
                [1]
            );
            expect(pool.query).toHaveBeenNthCalledWith(
                3,
                expect.stringContaining('SELECT COUNT(*) as count'),
                ['%John%', '%John%', '%John%', '%John%']
            );
        });

        it('should return 401 if no token is provided', async () => {
            const response = await request(app).get('/api/employees');

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Access denied' });
        });
    });

    describe('POST /api/employees', () => {
        it('should create a new employee', async () => {
            pool.query.mockResolvedValueOnce([{ insertId: 1 }]);

            const response = await request(app)
                .post('/api/employees')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    first_name: 'Jane',
                    last_name: 'Doe',
                    email: 'jane@example.com',
                    position: 'Manager',
                    salary: 60000,
                    department_id: 1
                });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id: 1 });
            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO Employees (first_name, last_name, email, position, salary, department_id) VALUES (?, ?, ?, ?, ?, ?)',
                ['Jane', 'Doe', 'jane@example.com', 'Manager', 60000, 1]
            );
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/employees')
                .set('Authorization', `Bearer ${token}`)
                .send({ first_name: 'Jane' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Required fields missing' });
        });
    });
});