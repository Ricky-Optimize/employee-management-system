const pool = require('./config/db');

async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1');
        console.log('Database connected:', rows);
    } catch (error) {
        console.error('Connection error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage
        });
    } finally {
        await pool.end();
    }
}

testConnection();