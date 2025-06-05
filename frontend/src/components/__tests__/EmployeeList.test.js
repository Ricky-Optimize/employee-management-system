import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import EmployeeList from '../EmployeeList';
import { getEmployees, getRoles, getEmployeeById, deleteEmployee, assignRole } from '../../utils/api';

jest.mock('../../utils/api');

describe('EmployeeList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getEmployees.mockResolvedValue({
            data: {
                employees: [
                    {
                        id: 1,
                        first_name: 'John',
                        last_name: 'Doe',
                        email: 'john@example.com',
                        position: 'Developer',
                        department_name: 'IT',
                        roles: [{ id: 1, title: 'Admin' }]
                    }
                ],
                total: 1
            }
        });
        getRoles.mockResolvedValue({ data: { roles: [{ id: 1, title: 'Admin' }] } });
    });

    it('renders employee list', async () => {
        render(
            <MemoryRouter>
                <EmployeeList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText('Admin')).toBeInTheDocument();
        });
    });

    it('searches employees', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <EmployeeList />
            </MemoryRouter>
        );

        await userEvent.type(screen.getByPlaceholderText('Search by name,'), 'John');
        await waitFor(() => {
            expect(getEmployees).toHaveBeenCalledWith({ page: 1, limit: 5, search: 'John' });
        });
    });

    it('opens role assignment modal', async () => {
        const user = userEvent.setup();
        getEmployeeById.mockResolvedValue({ data: { roles: [{ id: 1, title: 'Admin' }] } });
        render(
            <MemoryRouter>
                <EmployeeList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        await userEvent.click(screen.getByText('Assign Roles'));

        await waitFor(() => {
            expect(screen.getByText(/Assign Roles to John Doe/)).toBeInTheDocument();
        });
    });

    it('assigns role in modal', async () => {
        const user = userEvent.setup();
        getEmployeeById.mockResolvedValue({ data: { roles: [] } });
        assignRole.mockResolvedValue({});
        render(
            <MemoryRouter>
                <EmployeeList />
            </MemoryRouter>
        );

        await userEvent.click(screen.getByText('Assign Roles'));
        await userEvent.click(screen.getByLabelText('Admin'));

        await waitFor(() => {
            expect(assignRole).toHaveBeenCalledWith({ employee_id: 1, role_id: 1 });
        });
    });

    it('deletes employee after confirmation', async () => {
        const user = userEvent.setup();
        deleteEmployee.mockResolvedValue({});
        window.confirm = jest.fn(() => true);
        render(
            <MemoryRouter>
                <EmployeeList />
            </MemoryRouter>
        );

        await waitFor(() => {
            userEvent.click(screen.getByRole('button', { name: /Delete/i }));
        });
        await waitFor(() => {
            expect(deleteEmployee).toHaveBeenCalledWith(1);
        });
    });

    it('displays error on fetch failure', async () => {
        getEmployees.mockRejectedValue({ response: { data: { error: 'Fetch failed' } } });
        render(
            <MemoryRouter>
                <EmployeeList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Fetch failed')).toBeInTheDocument();
        });
    });
});