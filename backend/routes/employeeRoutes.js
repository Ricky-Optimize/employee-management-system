const express = require('express');
const router = express.Router();
const {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    assignRole,
    unassignRole
} = require('../controllers/employeeController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, getEmployees);
router.get('/:id', authenticateToken, getEmployeeById);
router.post('/', authenticateToken, createEmployee);
router.put('/:id', authenticateToken, updateEmployee);
router.delete('/:id', authenticateToken, deleteEmployee);
router.post('/assign-role', authenticateToken, assignRole);
router.delete('/unassign-role', authenticateToken, unassignRole);

module.exports = router;