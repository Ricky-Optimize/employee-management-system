import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import EmployeeForm from '../EmployeeForm';
import { getDepartments, getRoles, createEmployee, getEmployeeById, assignRole } from '../../utils/api';

jest.mock('../../utils/api');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useParams: () => ({ id: undefined })
}));

describe('EmployeeForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getDepartments.mockResolvedValue({ data: [{ id: 1, name: 'IT' }] });
        getRoles.mockResolvedValue({ data: { roles: [{ id: 1, title: 'Admin' }] } });
    });

    it('renders create form correctly', async () => {
        render(
            <MemoryRouter>
                <EmployeeForm />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Add Employee')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByLabelText('Department')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByLabelText('Roles')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText('Admin')).toBeInTheDocument();
        });
    });

    it('shows validation errors', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <EmployeeForm />
            </MemoryRouter>
        );

        await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

        await waitFor(() => {
            expect(screen.getByText('Required')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText('Invalid email')).toBeInTheDocument();
        });
    });

    it('submits create form successfully', async () => {
        const user = userEvent.setup();
        const navigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);
        createEmployee.mockResolvedValue({ data: { id: 1 } });
        assignRole.mockResolvedValue({});
        render(
            <MemoryRouter>
                <EmployeeForm />
            </MemoryRouter>
        );

        await userEvent.type(screen.getByLabelText('First Name'), 'John');
        await userEvent.type(screen.getByLabelText('Last Name'), 'Doe');
        await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
        await userEvent.type(screen.getByLabelText('Position'), 'Developer');
        await userEvent.type(screen.getByLabelText('Salary'), '50000');
        await userEvent.selectOptions(screen.getByLabelText('Department'), '1');
        await userEvent.click(screen.getByLabelText('Admin'));
        await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

        await waitFor(() => {
            expect(createEmployee).toHaveBeenCalledWith({
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                position: 'Developer',
                salary: '50000',
                department_id: '1'
            });
        });
        await waitFor(() => {
            expect(assignRole).toHaveBeenCalledWith({ employee_id: 1, role_id: 1 });
        });
        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith('/employees');
        });
    });

    it('renders edit form with pre-filled data', async () => {
        jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ id: '1' });
        getEmployeeById.mockResolvedValue({
            data: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                position: 'Developer',
                salary: 50000,
                department_id: 1,
                roles: [{ id: 1, title: 'Admin' }]
            }
        });

        render(
            <MemoryRouter initialEntries={['/employees/edit/1']}>
                <EmployeeForm />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByLabelText('First Name')).toHaveValue('John');
        });
        await waitFor(() => {
            expect(screen.getByLabelText('Admin')).toBeChecked();
        });
    });

    it('displays error on submission failure', async () => {
        const user = userEvent.setup();
        createEmployee.mockRejectedValue({ response: { data: { error: 'Create failed' } } });
        render(
            <MemoryRouter>
                <EmployeeForm />
            </MemoryRouter>
        );

        await userEvent.type(screen.getByLabelText('First Name'), 'John');
        await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
        await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

        await waitFor(() => {
            expect(screen.getByText('Create failed')).toBeInTheDocument();
        });
    });
});