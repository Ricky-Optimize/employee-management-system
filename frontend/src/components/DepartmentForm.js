import React from 'react';
import { Formik, Form, Field } from 'formik';
import { createDepartment, updateDepartment } from '../utils/api';

const DepartmentForm = ({ onClose, editingDepartment }) => {
    const initialValues = editingDepartment || { name: '', location: '' };

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            if (editingDepartment) {
                await updateDepartment(editingDepartment.id, values);
            } else {
                await createDepartment(values);
            }
            onClose();
        } catch (error) {
            setErrors({ submit: error.response?.data?.error || 'Failed to save department' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded mb-6">
            <h3 className="text-xl font-bold mb-4">{editingDepartment ? 'Edit Department' : 'Add Department'}</h3>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validateOnChange={false}>
                {({ isSubmitting, errors }) => (
                    <Form>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700">
                                Name
                            </label>
                            <Field
                                id="name"
                                name="name"
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder="Enter department name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="location" className="block text-gray-700">
                                Location
                            </label>
                            <Field
                                id="location"
                                name="location"
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder="Enter department location"
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

export default DepartmentForm;