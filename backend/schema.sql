CREATE DATABASE employee_management;
USE employee_management;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE Departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100)
);

CREATE TABLE Employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  position VARCHAR(100),
  salary DECIMAL(10, 2),
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES Departments(id)
);

CREATE TABLE Roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE EmployeeRoles (
  employee_id INT,
  role_id INT,
  PRIMARY KEY (employee_id, role_id),
  FOREIGN KEY (employee_id) REFERENCES Employees(id),
  FOREIGN KEY (role_id) REFERENCES Roles(id)
);

INSERT INTO Departments (name, location)
VALUES
  ('Engineering', 'New York'),
  ('HR', 'Chicago');

INSERT INTO Employees (first_name, last_name, email, position, salary, department_id)
VALUES
  ('John', 'Doe', 'john.doe@example.com', 'Developer', 60000, 1),
  ('Jane', 'Smith', 'jane.smith@example.com', 'Manager', 80000, 2);

INSERT INTO Roles (title, description)
VALUES
  ('Team Lead', 'Leads a project team'),
  ('Developer', 'Writes code'),
  ('Analyst', 'Analyzes data');

INSERT INTO EmployeeRoles (employee_id, role_id)
VALUES
  (1, 2),
  (1, 3),
  (2, 1);

INSERT INTO Users (email, password)
VALUES
  ('test@example.com', '$2a$10$XUrkwi3u3Y4esdSH2f.aq.8J8c./g1mFykdEsPBz2j1qK3R3K7e9K'); -- password: password123