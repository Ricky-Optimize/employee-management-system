import { FaUsers, FaBuilding, FaUserTag, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg mb-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
                    <FaUsers className="mr-3" /> Welcome to Employee Management System
                </h2>
                <p className="text-lg md:text-xl max-w-2xl mx-auto">
                    Streamline your workforce management with our intuitive system for employees, departments, and roles.
                </p>
                <Link
                    to="/employees"
                    className="mt-6 inline-flex items-center bg-white text-blue-600 py-2 px-6 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                >
                    Get Started <FaArrowRight className="ml-2" />
                </Link>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
                    <div className="flex items-center mb-4">
                        <FaUsers className="text-blue-500 text-3xl mr-3" />
                        <h3 className="text-xl font-semibold text-gray-800">Employee Management</h3>
                    </div>
                    <p className="text-gray-600">
                        Easily add, edit, and track employee details, including roles and departments.
                    </p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
                    <div className="flex items-center mb-4">
                        <FaBuilding className="text-blue-500 text-3xl mr-3" />
                        <h3 className="text-xl font-semibold text-gray-800">Department Organization</h3>
                    </div>
                    <p className="text-gray-600">
                        Organize your workforce by departments for better structure and oversight.
                    </p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
                    <div className="flex items-center mb-4">
                        <FaUserTag className="text-blue-500 text-3xl mr-3" />
                        <h3 className="text-xl font-semibold text-gray-800">Role Assignment</h3>
                    </div>
                    <p className="text-gray-600">
                        Assign and manage roles to ensure clear responsibilities and permissions.
                    </p>
                </div>
            </div>

            {/* Call to Action */}
            <div className="text-center py-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Ready to Optimize Your Workforce?
                </h3>
                <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                    Join our platform to manage your employees efficiently and take control of your organizational structure.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link
                        to="/register"
                        className="inline-flex items-center bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                    >
                        Sign Up <FaArrowRight className="ml-2" />
                    </Link>
                    <Link
                        to="/signin"
                        className="inline-flex items-center bg-gray-200 text-gray-800 py-2 px-6 rounded-lg font-semibold hover:bg-gray-300 transition duration-200"
                    >
                        Sign In <FaArrowRight className="ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;