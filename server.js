const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const PasswordPrompt = require('inquirer/lib/prompts/password');

const connection = mysql.createConnection({
    host: 'localhost',
    port: process.env.PORT || 3306,
    password: 'blink-182',
    user: 'root',
    database: 'CMS'
});

connection.connect((err) => {
    if (err) throw err;
    console.table(`
  ____ ____ ____ ____ ____ ____ ____ ____ 
 ||E |||m |||p |||l |||o |||y |||e |||e ||
 ||__|||__|||__|||__|||__|||__|||__|||__||
 |/__\||/__\||/__\||/__\||/__\||/__\||/__\|||/__\||                                                   
  ____ ____ ____ ____ ____ ____ ____      
 ||M |||a |||n |||a |||g |||e |||r ||     
 ||__|||__|||__|||__|||__|||__|||__||     
 |/__\||/__\||/__\||/__\||/__\||/__\||/__\||                                                   
 `);
    xRoad();
});


const xRoad = () => {
    inquirer.prompt([
        {
          type: 'rawlist',
          name: 'choice',
          message: 'What would you like to do?',
          choices: [
            { title: 'View All Employees', value: 'View All Employees' },
            { title: 'View All Employees By Department', value: 'View All Employees By Department' },
            { title: 'View All Roles', value: 'View All Roles' },
            { title: 'View All Employees By Manager', value: 'View All Employees By Manager' },
            { title: 'View the total utilized budget of a department', value: 'View the total utilized budget of a department' },
            { title: 'Add Employee', value: 'Add Employee' },
            { title: 'Add Role', value: 'Add Role' },
            { title: 'Add Department', value: 'Add Department' },
            { title: 'Update Employee', value: 'Update Employee' },
            { title: 'Update Employee Role', value: 'Update Employee Role' },
            { title: 'Update Employee Manager', value: 'Update Employee Manager' },
            { title: 'Remove Employee', value: 'Remove Employee' },
            { title: 'Remove Department', value: 'Remove Department' },
            { title: 'Remove Role', value: 'Remove Role' },
            { title: 'Exit', value: 'Exit' },
          ],
          hint: '- Space to select. Return to submit'
        }
    ])
        .then(res => {
            switch(res.choice) {
                case 'View All Employees':
                  return viewAllEmp();
                case 'View All Employees By Department':
                  return viewAllByDept();
                case 'View All Roles':
                  return viewAllRole();
                case 'View All Employees By Manager':
                    return viewAllByManager();
                case 'View the total utilized budget of a department':
                    return viewAllByBudgetSalary();
                case 'Add Employee':
                    return addEmp();
                case 'Add Role':
                    return addRole();
                case 'Add Department':
                    return addDepartment();
                case 'Update Employee':
                    return updateEmployee();
                case 'Update Employee Role':
                    return updateEmployeeRole();
                case 'Update Employee Manager':
                    return updateEmployeeManager();
                case 'Remove Employee':
                return removeEmployee();
                    case 'Remove Role':
                return removeRole();
                    case 'Exit':
                return closeConnection();
                default:
                return xRoad();
              }
        }) 
}

const closeConnection = () => {
    connection.end();
}

const viewAllEmp = () => {
    connection.query("SELECT * FROM employee", (err, result) => {
        if(err) throw err;
        console.table(result);
        xRoad()
    })
}

const viewAllByDept = () => {
    connection.query("SELECT * FROM department", (err, result) => {
        if(err) throw err;
        console.table(result);
        xRoad()
    })   
}

const viewAllRole = () => {
    connection.query("SELECT * FROM role", (err, result) => {
        if(err) throw err;
        console.table(result);
        xRoad()
    })   
}
// Need to only select IS 'manager_id' NOT NULL
const viewAllByManager = () => {
    connection.query("SELECT first_name, last_name, role_id, manager_id FROM employee WHERE 'manager_id' IS NOT NULL", (err, result) => {
        if(err) throw err;
        console.table(result);
        xRoad()
    })   
}

// Need to join Department ID
const viewAllByBudgetSalary = () => {
    connection.query("SELECT department_id, SUM(salary) as totalSum FROM role GROUP BY department_id", (err, result) => {
        if(err) throw err;
        console.table(result);
        xRoad()
    })   
}