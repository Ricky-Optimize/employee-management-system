import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RoleAssignment from '../RoleAssignment';
import { getEmployees, getRoles, getEmployeeById, assignRole } from '../../utils/api';

jest.mock('../../utils/api');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));

describe('RoleAssignment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getEmployees.mockResolvedValue({
            data: { employees: [{ id: 1, first_name: 'John', last_name: 'Doe' }] }
        });
        getRoles.mockResolvedValue({ data: [{ id: 1, title: 'Admin' }] });
    });

    it('renders employee dropdown', async () => {
        render(
            <MemoryRouter>
                <RoleAssignment />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
    });

    it('loads roles for selected employee', async () => {
        const user = userEvent.setup();
        getEmployeeById.mockResolvedValue({ data: { roles: [{ id: 1, title: 'Admin' }] } });
        render(
            <MemoryRouter>
                <RoleAssignment />
            </MemoryRouter>
        );

        await userEvent.selectOptions(screen.getByLabelText('Select Employee'), '1');
        await waitFor(() => {
            expect(screen.getByLabelText('Admin')).toBeChecked();
        });
    });

    it('assigns role', async () => {
        const user = userEvent.setup();
        getEmployeeById.mockResolvedValue({ data: { roles: [] } });
        assignRole.mockResolvedValue({});
        render(
            <MemoryRouter>
                <RoleAssignment />
            </MemoryRouter>
        );

        await userEvent.selectOptions(screen.getByLabelText('Select Employee'), '1');
        await userEvent.click(screen.getByLabelText('Admin'));

        await waitFor(() => {
            expect(assignRole).toHaveBeenCalledWith({ employee_id: 1, role_id: 1 });
        });
    });

    it('displays error on fetch failure', async () => {
        getEmployees.mockRejectedValue({ response: { data: { error: 'Fetch failed' } } });
        render(
            <MemoryRouter>
                <RoleAssignment />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Fetch failed')).toBeInTheDocument();
        });
    });
});