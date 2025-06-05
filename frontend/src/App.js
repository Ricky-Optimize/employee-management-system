import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Roles from './pages/Roles';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import EmployeeForm from './components/EmployeeForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  console.log('App component rendered');
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/employees" element={<ProtectedRoute element={<Employees />} />} />
            <Route path="/employees/add" element={<ProtectedRoute element={<EmployeeForm />} />} />
            <Route path="/employees/edit/:id" element={<ProtectedRoute element={<EmployeeForm />} />} />
            <Route path="/departments" element={<ProtectedRoute element={<Departments />} />} />
            <Route path="/roles" element={<ProtectedRoute element={<Roles />} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;