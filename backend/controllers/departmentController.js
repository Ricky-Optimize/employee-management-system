const pool = require('../config/db');

const getDepartments = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Departments');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Fetch departments error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage
        });
        res.status(500).json({ error: 'Database error fetching departments' });
        next(error);
    }
};

const createDepartment = async (req, res, next) => {
    try {
        const { name, location } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Department name is required' });
        }
        console.log('Creating department:', { name, location });
        const [result] = await pool.query('INSERT INTO Departments (name, location) VALUES (?, ?)', [name, location || '']);
        console.log('Department created, ID:', result.insertId);
        res.status(201).json({ message: 'Department created', id: result.insertId });
    } catch (error) {
        console.error('Create department error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage
        });
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({ error: 'Departments table does not exist' });
        }
        res.status(500).json({ error: 'Database error creating department' });
        next(error);
    }
};

const updateDepartment = async (req, res, next) => {
    try {
        const { name, location } = req.body;
        const { id } = req.params;
        if (!name) {
            return res.status(400).json({ error: 'Department name is required' });
        }
        const [result] = await pool.query('UPDATE Departments SET name = ?, location = ? WHERE id = ?', [name, location || '', id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.status(200).json({ message: 'Department updated' });
    } catch (error) {
        console.error('Update department error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage
        });
        res.status(500).json({ error: 'Database error updating department' });
        next(error);
    }
};

const deleteDepartment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM Departments WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.status(200).json({ message: 'Department deleted' });
    } catch (error) {
        console.error('Delete department error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage
        });
        res.status(500).json({ error: 'Database error deleting department' });
        next(error);
    }
};

module.exports = {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
};