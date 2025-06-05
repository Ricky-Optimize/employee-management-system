import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees, getRoles, assignRole, unassignRole, getEmployeeById, deleteEmployee } from '../utils/api';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaUserPlus, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const limit = 5;

    const fetchData = useCallback(async (retryCount = 3) => {
        try {
            setLoading(true);
            setError(null);
            const [empRes, roleRes] = await Promise.all([
                getEmployees({ page, limit, search }),
                getRoles()
            ]);
            console.log('Fetched employees:', empRes.data);
            setEmployees(empRes.data.employees || []);
            setTotal(empRes.data.total || 0);
            setRoles(roleRes.data.roles || []);
        } catch (error) {
            console.error('Fetch error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            if (retryCount > 0) {
                console.log(`Retrying... (${retryCount} attempts left)`);
                setTimeout(() => fetchData(retryCount - 1), 1000);
            } else {
                setError(error.response?.data?.error || 'Failed to load data');
            }
        } finally {
            setLoading(false);
        }
    }, [page, search, limit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openRoleModal = async (employee) => {
        try {
            setError(null);
            setSelectedEmployee(employee);
            const res = await getEmployeeById(employee.id);
            setSelectedRoles(res.data.roles?.map(role => role.id) || []);
            console.log('Fetched employee roles:', res.data.roles);
            setRoleModalOpen(true);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to load roles');
            console.error('Fetch employee roles error:', error);
        }
    };

    const handleRoleChange = async (roleId, checked) => {
        try {
            setError(null);
            setLoading(true);
            if (checked) {
                await assignRole({ employee_id: selectedEmployee.id, role_id: roleId });
                setSelectedRoles(prev => [...prev, roleId]);
            } else {
                await unassignRole({ employee_id: selectedEmployee.id, role_id: roleId });
                setSelectedRoles(prev => prev.filter(id => id !== roleId));
            }
            await fetchData();
        } catch (error) {
            setError(error.response?.data?.error || 'Role operation failed');
            console.error('Role change error:', error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                setError(null);
                setLoading(true);
                await deleteEmployee(id);
                await fetchData();
            } catch (error) {
                setError(error.response?.data?.error || 'Failed to delete employee');
                console.error('Delete employee error:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Employees</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative w-full sm:w-64">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or department"
                            value={search}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                    <Link
                        to="/employees/add"
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-transform duration-200 transform hover:scale-105"
                    >
                        <FaPlus className="mr-2" />
                        Add Employee
                    </Link>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                    <FaTimes className="mr-2" />
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <FaSpinner className="animate-spin text-blue-500 text-3xl mr-2" />
                    <span className="text-gray-600">Loading...</span>
                </div>
            ) : employees.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No employees found</div>
            ) : (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Roles</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {employees.map((emp, index) => (
                                    <tr
                                        key={emp.id}
                                        className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {emp.first_name} {emp.last_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.position}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.department_name || 'None'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {emp.roles && emp.roles.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {emp.roles.map(role => (
                                                        <span
                                                            key={role.id}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                        >
                                                            {role.title}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">None</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                to={`/employees/edit/${emp.id}`}
                                                className="text-blue-600 hover:text-blue-800 mr-4 flex items-center"
                                            >
                                                <FaEdit className="mr-1" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(emp.id)}
                                                className="text-red-600 hover:text-red-800 flex items-center"
                                            >
                                                <FaTrash className="mr-1" />
                                                Delete
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => openRoleModal(emp)}
                                                className="flex items-center bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-transform duration-200 transform hover:scale-105"
                                            >
                                                <FaUserPlus className="mr-1" />
                                                Assign Roles
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {total > limit && (
                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-600">
                        Page {page} of {Math.ceil(total / limit)}
                    </span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page * limit >= total}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Role Assignment Modal */}
            {roleModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Assign Roles to {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                        </h3>
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                                <FaTimes className="mr-2" />
                                {error}
                            </div>
                        )}
                        {loading && (
                            <div className="mb-4 flex items-center text-blue-600">
                                <FaSpinner className="animate-spin mr-2" />
                                Processing...
                            </div>
                        )}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
                            {roles.length === 0 ? (
                                <p className="text-gray-500 text-sm">No roles available</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {roles.map(role => (
                                        <label key={role.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedRoles.includes(role.id)}
                                                onChange={(e) => handleRoleChange(role.id, e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                disabled={loading}
                                            />
                                            <span className="text-sm text-gray-700">{role.title}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setRoleModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:bg-gray-100 disabled:text-gray-400"
                                disabled={loading}
                            >
                                <FaTimes className="inline mr-1" />
                                Cancel
                            </button>
                            <button
                                onClick={() => setRoleModalOpen(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                                disabled={loading}
                            >
                                <FaSave className="inline mr-1" />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeeList;