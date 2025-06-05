import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element }) {
    const isAuthenticated = !!localStorage.getItem('token');
    console.log('ProtectedRoute: isAuthenticated:', isAuthenticated);
    return isAuthenticated ? element : <Navigate to="/signin" />;
}

export default ProtectedRoute;