import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoleForm from '../RoleForm';
import { createRole, updateRole } from '../../utils/api';

jest.mock('../../utils/api');

describe('RoleForm', () => {
    const onClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders create form correctly', async () => {
        render(<RoleForm onClose={onClose} />);
        await waitFor(() => {
            expect(screen.getByText('Add Role')).toBeInTheDocument();
        });
        expect(screen.getByLabelText('Title')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });

    it('submits create form successfully', async () => {
        createRole.mockResolvedValue({ data: { id: 1 } });
        render(<RoleForm onClose={onClose} />);

        await userEvent.type(screen.getByLabelText('Title'), 'Manager');
        await userEvent.type(screen.getByLabelText('Description'), 'Manages team');
        await userEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => expect(createRole).toHaveBeenCalledWith({ title: 'Manager', description: 'Manages team' }));
        await waitFor(() => expect(onClose).toHaveBeenCalled());
    });

    it('displays error on submission failure', async () => {
        createRole.mockRejectedValue({ response: { data: { error: 'Failed to create' } } });
        render(<RoleForm onClose={onClose} />);

        await userEvent.type(screen.getByLabelText('Title'), 'Manager');
        await userEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => expect(screen.getByText('Failed to create')).toBeInTheDocument());
    });

    it('renders edit form with pre-filled values', async () => {
        const editingRole = { id: 1, title: 'Admin', description: 'Admin role' };
        render(<RoleForm onClose={onClose} editingRole={editingRole} />);
        await waitFor(() => {
            expect(screen.getByText('Edit Role')).toBeInTheDocument();
        });
        expect(screen.getByLabelText('Title')).toHaveValue('Admin');
        expect(screen.getByLabelText('Description')).toHaveValue('Admin role');
    });

    it('submits edit form successfully', async () => {
        const editingRole = { id: 1, title: 'Admin', description: 'Admin role' };
        updateRole.mockResolvedValue({});
        render(<RoleForm onClose={onClose} editingRole={editingRole} />);

        await userEvent.clear(screen.getByLabelText('Title'));
        await userEvent.type(screen.getByLabelText('Title'), 'Super Admin');
        await userEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => expect(updateRole).toHaveBeenCalledWith(1, { title: 'Super Admin', description: 'Admin role' }));
        await waitFor(() => expect(onClose).toHaveBeenCalled());
    });
});