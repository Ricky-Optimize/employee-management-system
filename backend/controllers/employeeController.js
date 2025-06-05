const pool = require('../config/db');

const getEmployees = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;
        const searchTerm = `%${search}%`;

        // Fetch employees
        const [employees] = await pool.query(
            `SELECT e.id, e.first_name, e.last_name, e.email, e.position, e.salary, e.department_id,
                    d.name AS department_name
             FROM Employees e
             LEFT JOIN Departments d ON e.department_id = d.id
             WHERE e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ? OR d.name LIKE ?
             GROUP BY e.id
             LIMIT ? OFFSET ?`,
            [searchTerm, searchTerm, searchTerm, searchTerm, parseInt(limit), parseInt(offset)]
        );

        
        for (let emp of employees) {
            const [roles] = await pool.query(
                `SELECT r.id, r.title
                 FROM EmployeeRoles er
                 JOIN Roles r ON er.role_id = r.id
                 WHERE er.employee_id = ?`,
                [emp.id]
            );
            emp.roles = roles;
        }

       
        const [totalRows] = await pool.query(
            `SELECT COUNT(*) as count
             FROM Employees e
             LEFT JOIN Departments d ON e.department_id = d.id
             WHERE e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ? OR d.name LIKE ?`,
            [searchTerm, searchTerm, searchTerm, searchTerm]
        );

        console.log('Fetched employees:', { employees, total: totalRows[0].count });
        res.status(200).json({ employees, total: totalRows[0].count });
    } catch (error) {
        console.error('Fetch employees error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage,
            stack: error.stack
        });
        res.status(500).json({ error: 'Database error fetching employees' });
        next(error);
    }
};

const getEmployeeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            `SELECT e.*, d.name AS department_name
             FROM Employees e
             LEFT JOIN Departments d ON e.department_id = d.id
             WHERE e.id = ?`,
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const [roles] = await pool.query(
            `SELECT r.id, r.title
             FROM EmployeeRoles er
             JOIN Roles r ON er.role_id = r.id
             WHERE er.employee_id = ?`,
            [id]
        );

        rows[0].roles = roles;
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Fetch employee error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage,
            stack: error.stack
        });
        res.status(500).json({ error: 'Database error fetching employee' });
        next(error);
    }
};

const createEmployee = async (req, res, next) => {
    try {
        const { first_name, last_name, email, position, salary, department_id } = req.body;
        console.log('Received create employee request:', { first_name, last_name, email, position, salary, department_id });
        if (!first_name || !last_name || !email || !position || !salary) {
            return res.status(400).json({ error: 'Required fields missing' });
        }
        const [result] = await pool.query(
            'INSERT INTO Employees (first_name, last_name, email, position, salary, department_id) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, position, salary, department_id || null]
        );
        console.log('Employee created, ID:', result.insertId);
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error('Create employee error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage,
            stack: error.stack,
            requestBody: req.body
        });
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({ error: 'Employees table does not exist' });
        }
        if (error.code === 'ER_BAD_FIELD_ERROR') {
            return res.status(500).json({ error: 'Invalid field in query' });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'Invalid department_id: Department does not exist' });
        }
        res.status(500).json({ error: 'Database error creating employee' });
        next(error);
    }
};

const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, position, salary, department_id } = req.body;
        if (!first_name || !last_name || !email || !position || !salary) {
            return res.status(400).json({ error: 'Required fields missing' });
        }
        const [result] = await pool.query(
            'UPDATE Employees SET first_name = ?, last_name = ?, email = ?, position = ?, salary = ?, department_id = ? WHERE id = ?',
            [first_name, last_name, email, position, salary, department_id || null, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee updated' });
    } catch (error) {
        console.error('Update employee error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage
        });
        res.status(500).json({ error: 'Database error updating employee' });
        next(error);
    }
};

const deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM Employees WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted' });
    } catch (error) {
        console.error('Delete employee error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage
        });
        res.status(500).json({ error: 'Database error deleting employee' });
        next(error);
    }
};

const assignRole = async (req, res, next) => {
    try {
        const { employee_id, role_id } = req.body;
        if (!employee_id || !role_id) {
            return res.status(400).json({ error: 'Employee ID and Role ID are required' });
        }
        await pool.query('INSERT INTO EmployeeRoles (employee_id, role_id) VALUES (?, ?)', [employee_id, role_id]);
        res.status(201).json({ message: 'Role assigned' });
    } catch (error) {
        console.error('Assign role error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage
        });
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Role already assigned' });
        }
        res.status(500).json({ error: 'Database error assigning role' });
        next(error);
    }
};

const unassignRole = async (req, res, next) => {
    try {
        const { employee_id, role_id } = req.body;
        if (!employee_id || !role_id) {
            return res.status(400).json({ error: 'Employee ID and Role ID are required' });
        }
        const [result] = await pool.query('DELETE FROM EmployeeRoles WHERE employee_id = ? AND role_id = ?', [employee_id, role_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Role assignment not found' });
        }
        res.status(200).json({ message: 'Role unassigned' });
    } catch (error) {
        console.error('Unassign role error:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage
        });
        res.status(500).json({ error: 'Database error unassigning role' });
        next(error);
    }
};

module.exports = {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    assignRole,
    unassignRole
};
