import { useState, useEffect } from 'react';
import { getDepartments, deleteDepartment } from '../utils/api';

function DepartmentList({ onEdit }) {
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getDepartments();
            setDepartments(res.data || []);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to load departments');
            console.error('Fetch departments error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await deleteDepartment(id);
                setDepartments(departments.filter(dept => dept.id !== id));
            } catch (error) {
                setError(error.response?.data?.error || 'Failed to delete department');
                console.error('Delete department error:', error);
            }
        }
    };

    return (
        <div className="container mx-auto">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading ? (
                <p className="text-blue-500">Loading...</p>
            ) : departments.length === 0 ? (
                <p className="text-gray-500">No departments found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 text-left">Name</th>
                                <th className="p-2 text-left">Location</th>
                                <th className="p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map(dept => (
                                <tr key={dept.id} className="border-t hover:bg-gray-50">
                                    <td className="p-2">{dept.name}</td>
                                    <td className="p-2">{dept.location || 'N/A'}</td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => onEdit(dept)}
                                            className="text-blue-500 hover:underline mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(dept.id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default DepartmentList;