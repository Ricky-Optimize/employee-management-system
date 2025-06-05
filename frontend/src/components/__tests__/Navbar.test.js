import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));

describe('Navbar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('renders unauthenticated links', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    it('renders authenticated links', () => {
        localStorage.setItem('token', 'fake-token');
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText('Employees')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    });

    it('toggles mobile menu', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        await userEvent.click(screen.getByLabelText('Toggle mobile menu'));
        await waitFor(() => {
            expect(screen.getByText('Sign In')).toBeVisible();
        });
        await userEvent.click(screen.getByLabelText('Toggle mobile menu'));
        await waitFor(() => {
            expect(screen.getByText('Sign In')).not.toBeVisible();
        });
    });

    it('handles logout', async () => {
        const user = userEvent.setup();
        localStorage.setItem('token', 'fake-token');
        const navigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        await userEvent.click(screen.getByText('Logout'));
        await waitFor(() => {
            expect(localStorage.getItem('token')).toBeNull();
        });
        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith('/signin');
        });
    });
});