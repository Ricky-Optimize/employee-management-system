import React from 'react';
import { Formik, Form, Field } from 'formik';
import { createRole, updateRole } from '../utils/api';

const RoleForm = ({ onClose, editingRole }) => {
    const initialValues = editingRole || { title: '', description: '' };

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            if (editingRole) {
                await updateRole(editingRole.id, values);
            } else {
                await createRole(values);
            }
            onClose();
        } catch (error) {
            setErrors({ submit: error.response?.data?.error || 'Failed to save role' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded mb-6">
            <h3 className="text-xl font-bold mb-4">{editingRole ? 'Edit Role' : 'Add Role'}</h3>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validateOnChange={false}>
                {({ isSubmitting, errors }) => (
                    <Form>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-gray-700">
                                Title
                            </label>
                            <Field
                                id="title"
                                name="title"
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder="Enter role title"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-gray-700">
                                Description
                            </label>
                            <Field
                                id="description"
                                name="description"
                                as="textarea"
                                rows="4"
                                className="w-full p-2 border rounded"
                                placeholder="Enter role description"
                            />
                        </div>
                        {errors.submit && <div className="text-red-500 mb-4">{errors.submit}</div>}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="bg-gray-300 text-black p-2 rounded mr-2 hover:bg-gray-400"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400 hover:bg-blue-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Submit'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default RoleForm;