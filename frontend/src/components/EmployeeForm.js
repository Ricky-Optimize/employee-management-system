import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getEmployeeById, createEmployee, updateEmployee, getDepartments, getRoles, assignRole, unassignRole } from '../utils/api';

function EmployeeForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);
    const [currentRoles, setCurrentRoles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            position: '',
            salary: '',
            department_id: '',
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('Required'),
            last_name: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
            position: Yup.string().required('Required'),
            salary: Yup.number().min(0, 'Salary must be positive').required('Required'),
            department_id: Yup.number().nullable(),
        }),
        onSubmit: async (values) => {
            try {
                setError(null);
                setLoading(true);
                let employeeId;
                if (id) {
                    await updateEmployee(id, values);
                    employeeId = id;
                } else {
                    console.log('Submitting employee data:', values);
                    const res = await createEmployee(values);
                    console.log('Create employee response:', res.data);
                    employeeId = res.data.id;
                }
                // Handle role assignments
                const currentRoleIds = new Set(currentRoles);
                const previousRoleIds = new Set(id ? (await getEmployeeById(id)).data.roles?.map(r => r.id) || [] : []);

                // Assign new roles
                for (const roleId of currentRoleIds) {
                    if (!previousRoleIds.has(roleId)) {
                        console.log(`Assigning role ${roleId} to employee ${employeeId}`);
                        await assignRole({ employee_id: parseInt(employeeId), role_id: roleId });
                    }
                }
                // Unassign removed roles
                for (const roleId of previousRoleIds) {
                    if (!currentRoleIds.has(roleId)) {
                        console.log(`Unassigning role ${roleId} from employee ${employeeId}`);
                        await unassignRole({ employee_id: parseInt(employeeId), role_id: roleId });
                    }
                }
                navigate('/employees');
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Operation failed';
                setError(errorMsg);
                console.error('Form submission error:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getDepartments().then(res => {
                console.log('Fetched departments:', res.data);
                setDepartments(res.data || []);
            }),
            getRoles().then(res => {
                console.log('Fetched roles:', res.data);
                setRoles(res.data.roles || []);
            })
        ]).catch(error => {
            const errorMsg = error.response?.data?.error || 'Failed to load data';
            setError(errorMsg);
            console.error('Fetch departments/roles error:', {
                message: error.message,
                response: error.response?.data
            });
        }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (id) {
            getEmployeeById(id)
                .then(res => {
                    const employee = res.data;
                    console.log('Fetched employee:', employee);
                    formik.setValues({
                        first_name: employee.first_name || '',
                        last_name: employee.last_name || '',
                        email: employee.email || '',
                        position: employee.position || '',
                        salary: employee.salary || '',
                        department_id: employee.department_id || '',
                    }, false);
                    setCurrentRoles(employee.roles?.map(role => role.id) || []);
                    console.log('Fetched employee roles:', employee.roles);
                })
                .catch(error => {
                    const errorMsg = error.response?.data?.error || 'Failed to load employee';
                    setError(errorMsg);
                    console.error('Fetch employee error:', {
                        message: error.message,
                        response: error.response?.data
                    });
                });
        }
    }, [id, formik]);

    const handleRoleChange = (roleId, isSelected) => {
        setCurrentRoles(prev =>
            isSelected ? [...prev, roleId] : prev.filter(r => r !== roleId)
        );
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Employee' : 'Add Employee'}</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading && <p className="text-blue-500 mb-4">Loading...</p>}
            <form onSubmit={formik.handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
                <div className="mb-4">
                    <label className="block text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.first_name}
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    />
                    {formik.touched.first_name && formik.errors.first_name && (
                        <p className="text-red-500">{formik.errors.first_name}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.last_name}
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    />
                    {formik.touched.last_name && formik.errors.last_name && (
                        <p className="text-red-500">{formik.errors.last_name}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500">{formik.errors.email}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Position</label>
                    <input
                        type="text"
                        name="position"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.position}
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    />
                    {formik.touched.position && formik.errors.position && (
                        <p className="text-red-500">{formik.errors.position}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Salary</label>
                    <input
                        type="number"
                        name="salary"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.salary}
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    />
                    {formik.touched.salary && formik.errors.salary && (
                        <p className="text-red-500">{formik.errors.salary}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Department</label>
                    <select
                        name="department_id"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.department_id}
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    >
                        <option value="">None</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                    {formik.touched.department_id && formik.errors.department_id && (
                        <p className="text-red-500">{formik.errors.department_id}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Roles</label>
                    {roles.length === 0 ? (
                        <p className="text-gray-500">No roles available</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {roles.map(role => (
                                <label key={role.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={currentRoles.includes(role.id)}
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
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/employees')}
                        className="bg-gray-300 text-black p-2 rounded mr-2 hover:bg-gray-400"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400 hover:bg-blue-600"
                        disabled={loading}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EmployeeForm;