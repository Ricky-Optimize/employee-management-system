import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees, getRoles, assignRole, unassignRole, getEmployeeById } from '../utils/api';

function RoleAssignment() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getEmployees({ page: 1, limit: 100 }).then(res => setEmployees(res.data.employees || [])),
            getRoles().then(res => setRoles(res.data || []))
        ]).catch(err => {
            setError(err.response?.data?.error || 'Failed to load data');
            console.error('Fetch error:', err);
        }).finally(() => setLoading(false));
    }, []);

    const handleEmployeeChange = async (e) => {
        const employeeId = e.target.value;
        setSelectedEmployee(employeeId);
        if (employeeId) {
            try {
                const res = await getEmployeeById(employeeId);
                setSelectedRoles(res.data.roles?.map(role => role.id) || []);
                console.log('Fetched employee roles:', res.data.roles);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load roles');
                console.error('Fetch employee error:', err);
            }
        } else {
            setSelectedRoles([]);
        }
    };

    const handleRoleChange = async (roleId, checked) => {
        try {
            setError(null);
            setLoading(true);
            if (checked) {
                await assignRole({ employee_id: parseInt(selectedEmployee), role_id: roleId });
                setSelectedRoles(prev => [...prev, roleId]);
            } else {
                await unassignRole({ employee_id: parseInt(selectedEmployee), role_id: roleId });
                setSelectedRoles(prev => prev.filter(id => id !== roleId));
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Role operation failed');
            console.error('Role change error:', error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Assign Roles</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading && <p className="text-blue-500 mb-4">Loading...</p>}
            <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
                <div className="mb-4">
                    <label className="block text-gray-600 mb-1">Select Employee</label>
                    <select
                        value={selectedEmployee}
                        onChange={handleEmployeeChange}
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    >
                        <option value="">Select an employee</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                        ))}
                    </select>
                </div>
                {selectedEmployee && (
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-1">Roles</label>
                        {roles.length === 0 ? (
                            <p className="text-gray-500">No roles available</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {roles.map(role => (
                                    <label key={role.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.includes(role.id)}
                                            onChange={(e) => handleRoleChange(role.id, e.target.checked)}
                                            className="mr-2"
                                            disabled={loading}
                                        />
                                        {role.title}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                <button
                    onClick={() => navigate('/employees')}
                    className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
                    disabled={loading}
                >
                    Back to Employees
                </button>
            </div>
        </div>
    );
}

export default RoleAssignment;