import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export const getEmployees = async ({ page, limit, search }) => {
    return await apiClient.get('/employees', { params: { page, limit, search } });
};

export const getEmployeeById = async (id) => {
    return await apiClient.get(`/employees/${id}`);
};

export const createEmployee = async (employeeData) => {
    return await apiClient.post('/employees', employeeData);
};

export const updateEmployee = async (id, employeeData) => {
    return await apiClient.put(`/employees/${id}`, employeeData);
};

export const deleteEmployee = async (id) => {
    return await apiClient.delete(`/employees/${id}`);
};

export const getDepartments = async () => {
    return await apiClient.get('/departments');
};

export const createDepartment = async (departmentData) => {
    return await apiClient.post('/departments', departmentData);
};

export const updateDepartment = async (id, departmentData) => {
    return await apiClient.put(`/departments/${id}`, departmentData);
};

export const deleteDepartment = async (id) => {
    return await apiClient.delete(`/departments/${id}`);
};

export const getRoles = async () => {
    return await apiClient.get('/roles');
};

export const createRole = async (roleData) => {
    return await apiClient.post('/roles', roleData);
};

export const updateRole = async (id, roleData) => {
    return await apiClient.put(`/roles/${id}`, roleData);
};

export const deleteRole = async (id) => {
    return await apiClient.delete(`/roles/${id}`);
};

export const assignRole = async ({ employee_id, role_id }) => {
    return await apiClient.post('/employees/assign-role', { employee_id, role_id });
};

export const unassignRole = async ({ employee_id, role_id }) => {
    return await apiClient.delete('/employees/unassign-role', { data: { employee_id, role_id } });
};