const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) throw err;
    menu();
});

const menu = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'View all employees by roles',
                'View all departments',
                'Add employee',
                'Add a role',
                'Add a department',
                'Update employee'
            ]
        }).then((answer) => {
            switch (answer.action) {
                case 'View all employees':
                    viewAllEmployees();
                    break;

                case 'View all departments':
                    viewAllDepartments();
                    break;

                case 'View all employees by roles':
                    viewAllRoles();
                    break;

                case 'Add employee':
                    addEmployee();
                    break;

                case 'Add a department':
                    addDepartment();
                    break;

                case 'Add a role':
                    addRole();
                    break;

                case 'Update employee':
                    updateEmployee();
                    break;
            }
        });
};

const viewAllEmployees = () => {

    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id",
        function (err, res) {
            if (err) throw err;
            console.table(res)
            menu();
        })
};

const viewAllRoles = () => {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title from employee JOIN role ON employee.role_id = role.id",
        function (err, res) {
            if (err) throw err;
            console.table(res)
            menu();
        })
};

const viewAllDepartments = () => {
    connection.query("SELECT * FROM department",
        function (err, res) {
            if (err) throw err;
            console.table(res)
            menu();
        })

}

const addEmployee = () => {
    inquirer
        .prompt([
            {
                name: 'firstname',
                type: 'input',
                message: "What is the employee's first name?"
            },
            {
                name: 'lastname',
                type: 'input',
                message: "What is this employee's last name?"
            },

        ]).then(function (answer) {
            connection.query('INSERT INTO employee SET ?',
                {
                    first_name: answer.firstname,
                    last_name: answer.lastname,
                    manager_id: null,
                    role_id: null
                }, function (err) {
                    if (err) throw err;
                    console.table(answer)
                    menu()
                })
        })
};

const updateEmployee = () => {
    let allEmployee = [];
    connection.query("SELECT * FROM employee", function (err, answer) {
        for (let i = 0; i < answer.length; i++) {
            let employeeData = answer[i].id + " " + answer[i].first_name + " " + answer[i].last_name;
            allEmployee.push(employeeData);
        }
        inquirer
            .prompt([
                {
                    name: 'updateEmpRole',
                    type: "list",
                    message: "Select the employee's new role.",
                    choices: allEmployee
                },

                {
                    name: 'newRole',
                    type: 'list',
                    message: "What is the employee's new job role?",
                    choices: ["manager", "employee"]
                },
            ]).then(function (answer) {
                const idUpdate = {};
                idUpdate.employeeId = parseInt(answer.updateEmpRole.split(" ")[0]);
                if (answer.newRole === "manager") {
                    idUpdate.role_id = 1;
                } else if (answer.newRole === "employee") {
                    idUpdate.role_id = 2;
                }
                connection.query("UPDATE employee SET role_id = ? WHERE id = ?",
                    [idUpdate.role_id, idUpdate.employeeId],
                    function (err, res) {
                        menu();
                    }
                );
            });
    });
};

const addRole = () => {
    inquirer
        .prompt([
            {
                name: "Title",
                type: "input",
                message: "What is the employee's title?"
            },
            {
                name: "Salary",
                type: "input",
                message: "What is their Salary?"
            },
            {
                name: "addDepartment",
                type: "input",
                message: "What is the Employee's Department id?"
            }
        ]).then(function (res) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: res.Title,
                    salary: res.Salary,
                    department_id: res.addDepartment
                },
                function (err, res) {
                    if (err) throw err;

                    console.table(res);
                }
            );
            menu();
        });
};

const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'dept',
                type: 'input',
                message: 'What Department would you like to add?'
            }
        ]).then(function (res) {
            connection.query("INSERT INTO department SET ?",
                {
                    name: res.dept
                },
                function (err) {
                    if (err) throw err
                }
            ),
                console.table(res);
            menu();
        });
};