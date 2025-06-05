import { useState, useEffect } from 'react';
import { getRoles, deleteRole } from '../utils/api';

function RoleList({ onEdit }) {
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getRoles();
            console.log('Fetched roles:', res.data);
            setRoles(res.data.roles || []);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to load roles';
            setError(errorMessage);
            console.error('Fetch roles error:', {
                message: errorMessage,
                status: error.response?.status,
                data: error.response?.data
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            try {
                setError(null);
                await deleteRole(id);
                console.log('Role deleted, ID:', id);
                setRoles(roles.filter(role => role.id !== id));
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Failed to delete role';
                setError(errorMessage);
                console.error('Delete role error:', {
                    message: errorMessage,
                    status: error.response?.status,
                    data: error.response?.data
                });
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Roles</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading ? (
                <p className="text-blue-500">Loading...</p>
            ) : roles.length === 0 ? (
                <p className="text-gray-500">No roles found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 text-left">Title</th>
                                <th className="p-2 text-left">Description</th>
                                <th className="p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map(role => (
                                <tr key={role.id} className="border-t hover:bg-gray-50">
                                    <td className="p-2">{role.title}</td>
                                    <td className="p-2">{role.description || 'N/A'}</td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => onEdit(role)}
                                            className="text-blue-500 hover:underline mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(role.id)}
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

export default RoleList;