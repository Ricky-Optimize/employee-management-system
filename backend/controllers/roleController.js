const pool = require('../config/db');

const getRoles = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Roles');
        console.log('Fetched roles:', rows);
        res.status(200).json({ roles: rows });
    } catch (error) {
        console.error('Fetch roles error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage,
            stack: error.stack
        });
        res.status(500).json({ error: 'Database error fetching roles' });
        next(error);
    }
};

const createRole = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        console.log('Creating role:', { title, description });
        if (!title) {
            return res.status(400).json({ error: 'Role title is required' });
        }
        const [result] = await pool.query(
            'INSERT INTO Roles (title, description) VALUES (?, ?)',
            [title, description || null]
        );
        console.log('Role created, ID:', result.insertId);
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error('Create role error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage,
            stack: error.stack,
            requestBody: req.body
        });
        res.status(500).json({ error: 'Database error creating role' });
        next(error);
    }
};

const updateRole = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { id } = req.params;
        console.log('Updating role ID:', id, { title, description });
        if (!title) {
            return res.status(400).json({ error: 'Role title is required' });
        }
        const [result] = await pool.query(
            'UPDATE Roles SET title = ?, description = ? WHERE id = ?',
            [title, description || null, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Role not found' });
        }
        console.log('Role updated, ID:', id);
        res.status(200).json({ message: 'Role updated' });
    } catch (error) {
        console.error('Update role error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage,
            stack: error.stack,
            requestBody: req.body
        });
        res.status(500).json({ error: 'Database error updating role' });
        next(error);
    }
};

const deleteRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('Deleting role ID:', id);
        const [result] = await pool.query('DELETE FROM Roles WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Role not found' });
        }
        console.log('Role deleted, ID:', id);
        res.status(200).json({ message: 'Role deleted' });
    } catch (error) {
        console.error('Delete role error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage,
            stack: error.stack
        });
        res.status(500).json({ error: 'Database error deleting role' });
        next(error);
    }
};

module.exports = {
    getRoles,
    createRole,
    updateRole,
    deleteRole
};