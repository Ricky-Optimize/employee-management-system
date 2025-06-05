import { useState } from 'react';
import RoleList from '../components/RoleList';
import RoleForm from '../components/RoleForm';
import { FaPlus } from 'react-icons/fa';

function Roles() {
    const [showForm, setShowForm] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    const handleEdit = (role) => {
        setEditingRole(role);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingRole(null);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Roles</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingRole(null);
                    }}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-transform duration-200 transform hover:scale-105"
                >
                    <FaPlus className="mr-2" />
                    {showForm && !editingRole ? 'Cancel' : 'Add Role'}
                </button>
            </div>
            {showForm && (
                <RoleForm
                    editingRole={editingRole}
                    onClose={handleFormClose}
                />
            )}
            <RoleList onEdit={handleEdit} />
        </div>
    );
}

export default Roles;