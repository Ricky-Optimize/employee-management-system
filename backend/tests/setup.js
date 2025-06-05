const pool = require('../config/db');

jest.mock('../config/db', () => ({
    query: jest.fn()
}));

beforeEach(() => {
    jest.clearAllMocks();
});