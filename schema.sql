DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
	id INT AUTO_INCREMENT NOT NULL,
     name VARCHAR(30),
     PRIMARY KEY (id)
     );

CREATE TABLE role (
	 id INT AUTO_INCREMENT NOT NULL ,
     title VARCHAR(30),
     salary DECIMAL(10,2),
     department_id INT,
     PRIMARY KEY(id),
     FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
     );
     
CREATE TABLE employee (
 id INT AUTO_INCREMENT NOT NULL,
 first_name VARCHAR(30),
 last_name VARCHAR(30),
 role_id INT,
 manager_id INT,
 FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
 FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE,
 PRIMARY KEY(id)
 );



-- SEEDS
INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Management");

INSERT INTO role (title, salary, department_id)
VALUE ("Employee", 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Manager", 250000, 2);


INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Billy", "Bob", 1, NULL);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Courtney", "Hertig", 2, 1);


SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

