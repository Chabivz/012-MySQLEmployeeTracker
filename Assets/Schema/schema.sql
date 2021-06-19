DROP DATABASE IF EXISTS CMS;

CREATE DATABASE CMS;

USE CMS;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(20, 2),
    department_id INT,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INT,
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

INSERT INTO department
    (name)
VALUES
    ('Targaryen'),
    ('Lannister'),
    ('Stark');
    
INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Targaryen Queen', 750000, 1),
    ('Targaryen King', 500000, 1),
    ('Targaryen Knight', 50000, 1),
    ('Lannister King', 1000000, 2),
    ('Lannister Queen', 1000000, 2),
    ('Lannister Knight', 60000, 2),
    ('Stark King', 250000, 3),
    ('Stark Queen', 250000, 3),
    ('Stark Knight', 50000, 3);
    
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES  
    ('Daenerys', 'Targaryen', 1, NULL),
    ('Rhaehgar', 'Targaryen', 2, 1),
    ('George', 'Targaryen', 3, 1),
    ('Tywin', 'Lannister', 4, NULL),
    ('Joanna', 'Lannister', 5, 4),
    ('Jamie', 'Lannister', 6, 4),
    ('Ed', 'Stark', 7, NULL),
    ('Sansa', 'Stark', 8, 7),
    ('Jon', 'Snow', 9, 7);