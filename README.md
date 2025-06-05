Employee Management System
A full-stack CRUD application for managing employees, departments, and roles, with admin authentication, built with Node.js, Express, MySQL, and React with Tailwind CSS.
Prerequisites

Node.js (v20 or latest)
XAMPP (with MySQL running)
Git

Setup Instructions
Backend Setup

Navigate to the backend folder:cd backend


Install dependencies:npm install


Set up the MySQL database:
Start XAMPP and ensure MySQL is running.
Open phpMyAdmin (http://localhost/phpmyadmin).
Create a database named employee_management.
Run the SQL script in backend/schema.sql to create the tables.


Create a .env file in the backend folder with the following:PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=employee_management
JWT_SECRET=your_jwt_secret


Start the backend server:node index.js

The server will run on http://localhost:8080.

Frontend Setup

Navigate to the frontend folder:cd frontend


Install dependencies:npm install


Start the React app:npm start

The frontend will run on http://localhost:3000.

Database Schema
The SQL script (backend/schema.sql) creates the following tables:

Admins: Stores admin details (id, email, password).
Departments: Stores department details (id, name, location).
Employees: Stores employee details (id, first_name, last_name, email, position, salary, department_id).
Roles: Stores role details (id, title, description).
EmployeeRoles: Maps employees to roles (employee_id, role_id).

Features

Backend:
Admin registration and login with JWT authentication.
CRUD operations for Employees, Departments, and Roles.
Pagination and search for employees.
Input validation using express-validator.
Error handling with appropriate HTTP status codes.


Frontend:
Admin sign-in and registration.
View, add, edit, and delete employees, departments, and roles.
Assign/unassign roles to employees.
Pagination and search for employees.
Form validation using Formik and Yup.
Styled with Tailwind CSS.
Protected routes requiring authentication.



Usage

Register an admin account at http://localhost:3000/register.
Sign in at http://localhost:3000/signin.
Use the navigation to manage employees, departments, and roles.
Logout to clear the session.

Notes

Replace your_jwt_secret_key_12345 in the .env file with a secure key.
All API endpoints (except /auth/register and /auth/login) require a JWT token in the Authorization header.
Ensure XAMPP's MySQL is running before starting the backend.
If you encounter issues with inputs, ensure all form fields are properly bound to Formik's handleChange and handleBlur events.

Project Structure
employee-management-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── departmentController.js
│   │   └── roleController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── departmentRoutes.js
│   │   └── roleRoutes.js
│   ├── .env
│   ├── index.js
│   └── schema.sql
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── EmployeeForm.js
│   │   │   ├── EmployeeList.js
│   │   │   ├── DepartmentForm.js
│   │   │   ├── DepartmentList.js
|   |   |   |── RoleAssignment.js
│   │   │   ├── RoleForm.js
│   │   │   └── RoleList.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Employees.js
│   │   │   ├── Departments.js
│   │   │   ├── Roles.js
│   │   │   ├── SignIn.js
│   │   │   └── Register.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── index.css
│   │   └── App.js
│   └── tailwind.config.js
└── README.md

