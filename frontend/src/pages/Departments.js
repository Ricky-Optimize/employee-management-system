import { useState } from 'react';
import DepartmentList from '../components/DepartmentList';
import DepartmentForm from '../components/DepartmentForm';

function Departments() {
    const [showForm, setShowForm] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);

    const handleEdit = (department) => {
        setEditingDepartment(department);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingDepartment(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Departments</h2>
            <button
                onClick={() => {
                    setShowForm(!showForm);
                    setEditingDepartment(null);
                }}
                className="bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600"
            >
                {showForm && !editingDepartment ? 'Cancel' : 'Add Department'}
            </button>
            {showForm && (
                <DepartmentForm
                    editingDepartment={editingDepartment}
                    onClose={handleFormClose}
                />
            )}
            <DepartmentList onEdit={handleEdit} />
        </div>
    );
}

export default Departments;