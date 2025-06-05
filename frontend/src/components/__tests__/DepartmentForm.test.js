import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DepartmentForm from '../DepartmentForm';
import { createDepartment, updateDepartment } from '../../utils/api';

jest.mock('../../utils/api');

describe('DepartmentForm', () => {
    const onClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders create form correctly', async () => {
        render(<DepartmentForm onClose={onClose} />);
        await waitFor(() => {
            expect(screen.getByText('Add Department')).toBeInTheDocument();
        });
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Location')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });

    it('renders edit form with pre-filled values', async () => {
        const editingDepartment = { id: 1, name: 'IT', location: 'Office A' };
        render(<DepartmentForm editingDepartment={editingDepartment} onClose={onClose} />);
        await waitFor(() => {
            expect(screen.getByText('Edit Department')).toBeInTheDocument();
        });
        expect(screen.getByLabelText('Name')).toHaveValue('IT');
        expect(screen.getByLabelText('Location')).toHaveValue('Office A');
    });

    it('shows validation error for empty name', async () => {
        render(<DepartmentForm onClose={onClose} />);
        await userEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Department name is required')).toBeInTheDocument();
        });
    });

    it('submits create form successfully', async () => {
        createDepartment.mockResolvedValueOnce({ data: { id: 1 } });
        render(<DepartmentForm onClose={onClose} />);

        await userEvent.type(screen.getByLabelText('Name'), 'HR');
        await userEvent.type(screen.getByLabelText('Location'), 'Office B');
        await userEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => expect(createDepartment).toHaveBeenCalledWith({ name: 'HR', location: 'Office B' }));
        await waitFor(() => expect(onClose).toHaveBeenCalled());
        await waitFor(() => expect(screen.getByText('Saving...')).toBeInTheDocument());
    });

    it('submits edit form successfully', async () => {
        const editingDepartment = { id: 1, name: 'IT', location: 'Office A' };
        updateDepartment.mockResolvedValueOnce({});
        render(<DepartmentForm editingDepartment={editingDepartment} onClose={onClose} />);

        await userEvent.clear(screen.getByLabelText('Name'));
        await userEvent.type(screen.getByLabelText('Name'), 'HR');
        await userEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => expect(updateDepartment).toHaveBeenCalledWith(1, { name: 'HR', location: 'Office A' }));
        await waitFor(() => expect(onClose).toHaveBeenCalled());
    });

    it('displays error on submission failure', async () => {
        createDepartment.mockRejectedValueOnce({ response: { data: { error: 'Failed to create' } } });
        render(<DepartmentForm onClose={onClose} />);

        await userEvent.type(screen.getByLabelText('Name'), 'HR');
        await userEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => expect(screen.getByText('Failed to create')).toBeInTheDocument());
    });

    it('disables inputs and buttons during submission', async () => {
        createDepartment.mockImplementation(() => new Promise(() => { }));
        render(<DepartmentForm onClose={onClose} />);

        await userEvent.type(screen.getByLabelText('Name'), 'HR');
        await userEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => expect(screen.getByLabelText('Name')).toBeDisabled());
        await waitFor(() => expect(screen.getByLabelText('Location')).toBeDisabled());
        await waitFor(() => expect(screen.getByRole('button', { name: /Submit/i })).toBeDisabled());
        await waitFor(() => expect(screen.getByRole('button', { name: /Cancel/i })).toBeDisabled());
    });
});