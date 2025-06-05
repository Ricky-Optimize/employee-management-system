import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoleList from '../RoleList';
import { getRoles, deleteRole } from '../../utils/api';

jest.mock('../../utils/api');

describe('RoleList', () => {
    const onEdit = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders role list', async () => {
        getRoles.mockResolvedValue({ data: { roles: [{ id: 1, title: 'Admin', description: 'Admin role' }] } });
        render(<RoleList onEdit={onEdit} />);

        await waitFor(() => {
            expect(screen.getByText('Admin')).toBeInTheDocument();
        });
    });

    it('deletes role after confirmation', async () => {
        const user = userEvent.setup();
        getRoles.mockResolvedValue({ data: { roles: [{ id: 1, title: 'Admin' }] } });
        deleteRole.mockResolvedValue({});
        window.confirm = jest.fn(() => true);
        render(<RoleList onEdit={onEdit} />);

        await waitFor(() => {
            userEvent.click(screen.getByText('Delete'));
        });
        await waitFor(() => {
            expect(deleteRole).toHaveBeenCalledWith(1);
        });
    });
});