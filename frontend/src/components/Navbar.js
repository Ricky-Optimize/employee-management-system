import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaBuilding, FaUserTag, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsMobileMenuOpen(false);
        navigate('/signin');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center text-white text-2xl font-bold tracking-tight hover:text-blue-300 transition-colors duration-200">
                    <FaHome className="mr-2" />
                    Employee Management
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/employees"
                                className="flex items-center text-white text-base font-medium hover:text-blue-300 transition-colors duration-200"
                            >
                                <FaUsers className="mr-1" />
                                Employees
                            </Link>
                            <Link
                                to="/employees/add"
                                className="flex items-center text-white text-base font-medium hover:text-blue-300 transition-colors duration-200"
                            >
                                <FaUserPlus className="mr-1" />
                                Add Employee
                            </Link>
                            <Link
                                to="/departments"
                                className="flex items-center text-white text-base font-medium hover:text-blue-300 transition-colors duration-200"
                            >
                                <FaBuilding className="mr-1" />
                                Departments
                            </Link>
                            <Link
                                to="/roles"
                                className="flex items-center text-white text-base font-medium hover:text-blue-300 transition-colors duration-200"
                            >
                                <FaUserTag className="mr-1" />
                                Roles
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-white text-base font-medium bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-transform duration-200 transform hover:scale-105"
                            >
                                <FaSignOutAlt className="mr-1" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/signin"
                                className="flex items-center text-white text-base font-medium hover:text-blue-300 transition-colors duration-200"
                            >
                                <FaSignInAlt className="mr-1" />
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="flex items-center text-white text-base font-medium bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-transform duration-200 transform hover:scale-105"
                            >
                                <FaUserPlus className="mr-1" />
                                Register
                            </Link>
                        </>
                    )}
                </div>
                <button
                    className="md:hidden text-white text-2xl focus:outline-none"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-800 px-4 py-2">
                    <div className="flex flex-col space-y-2">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/employees"
                                    className="flex items-center text-white text-base font-medium hover:bg-gray-700 px-3 py-2 rounded transition-colors duration-200"
                                    onClick={toggleMobileMenu}
                                >
                                    <FaUsers className="mr-2" />
                                    Employees
                                </Link>
                                <Link
                                    to="/employees/add"
                                    className="flex items-center text-white text-base font-medium hover:bg-gray-700 px-3 py-2 rounded transition-colors duration-200"
                                    onClick={toggleMobileMenu}
                                >
                                    <FaUserPlus className="mr-2" />
                                    Add Employee
                                </Link>
                                <Link
                                    to="/departments"
                                    className="flex items-center text-white text-base font-medium hover:bg-gray-700 px-3 py-2 rounded transition-colors duration-200"
                                    onClick={toggleMobileMenu}
                                >
                                    <FaBuilding className="mr-2" />
                                    Departments
                                </Link>
                                <Link
                                    to="/roles"
                                    className="flex items-center text-white text-base font-medium hover:bg-gray-700 px-3 py-2 rounded transition-colors duration-200"
                                    onClick={toggleMobileMenu}
                                >
                                    <FaUserTag className="mr-2" />
                                    Roles
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-white text-base font-medium bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition-transform duration-200 transform hover:scale-105"
                                >
                                    <FaSignOutAlt className="mr-2" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/signin"
                                    className="flex items-center text-white text-base font-medium hover:bg-gray-700 px-3 py-2 rounded transition-colors duration-200"
                                    onClick={toggleMobileMenu}
                                >
                                    <FaSignInAlt className="mr-2" />
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center text-white text-base font-medium bg-green-600 px-3 py-2 rounded hover:bg-green-700 transition-transform duration-200 transform hover:scale-105"
                                    onClick={toggleMobileMenu}
                                >
                                    <FaUserPlus className="mr-2" />
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;