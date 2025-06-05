import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm">&copy; {new Date().getFullYear()} Employee Management System. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6 mb-4 md:mb-0">
                        <Link to="/" className="text-sm hover:text-blue-400 transition duration-200">Home</Link>
                        <Link to="/employees" className="text-sm hover:text-blue-400 transition duration-200">Employees</Link>
                        <Link to="/departments" className="text-sm hover:text-blue-400 transition duration-200">Departments</Link>
                        <Link to="/roles" className="text-sm hover:text-blue-400 transition duration-200">Roles</Link>
                    </div>
                    <div className="flex space-x-4">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-200">
                            <FaTwitter size={20} />
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-200">
                            <FaGithub size={20} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-200">
                            <FaLinkedin size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;