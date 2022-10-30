DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;

USE business_db;

CREATE TABLE department (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE RESTRICT
);

CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE RESTRICT,
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE RESTRICT
);

-- inserting seeds for departments
INSERT INTO department (name)
    VALUES('Accounting'),
          ('Software Engineer'),
          ('Marketing'),
          ('Customer Service');
-- inserting seeds for roles
INSERT INTO role (title, salary, department_id)
    VALUES('Accountant', 50000, 1),
          ('Social Media Manager', 60000, 3),
          ('Tech Support', 50000, 4),
          ('Product Designer', 65000, 3),
          ('Web Developer', 65000, 2),
          ('System Engineer', 80000, 2),
          ('Product Manager', 90000, 2);

-- inserting seeds for employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES('Jaye', "Underwood", 1, NULL),
          ('Karis', "Stamp", 2, 2),
          ('Malik', "Hayes", 3, NULL),
          ('Enya', "O'Brien", 3, NULL),
          ('Armani', "Ramirez", 5, NULL),
          ('Martha', "Lane", 6, NULL),
          ('Zaid', "Sierra", 7, 7),
          ('Eliana', "Reeve", 2, 8),
          ('Daniyal', "Cruz", 4, NULL),
          ('Jasper', "Pitt", 4, NULL),
          ('Nina', "Saunders", 5, NULL),
          ('Jez', "Schmidt", 1, NULL);


USE business_db;
SHOW TABLES;
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;