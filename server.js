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
 |/__\||/__\||/__\||/__\||/__\||/__\||/__\||/__\||                                                   
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
            { title: 'Update Employee Role', value: 'Update Employee Role' },
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
                    return viewEmpByManager();
                case 'View the total utilized budget of a department':
                    return viewAllByBudgetSalary();
                case 'Add Employee':
                    return addEmp();
                case 'Add Role':
                    return addRole();
                case 'Add Department':
                    return addDepartment();
                case 'Update Employee Role':
                    return updateEmployeeRole();
                case 'Remove Employee':
                    return removeEmployee();
                case 'Remove Role':
                    return removeRole();
                case 'Remove Department':
                    return removeDepartment();
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


// ------------------------- VIEW -------------------------

const viewAllEmp = () => {
    connection.query("SELECT * FROM employee RIGHT JOIN role ON employee.role_id = role.id WHERE first_name IS NOT NULL", (err, result) => {
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
const viewEmpByManager = () => {
    connection.query("SELECT * FROM employee", (err, manager) => {
        if(err) throw err;
        inquirer.prompt([
            {
                name: "manager",
                type: "rawlist",
                message: "Select team by manager you wanted to view.\n",
                choices() {
                    const managersArray = [];
                    manager.forEach(( { id, first_name, last_name, role_id, manager_id }) => {
                        if (manager_id === null) {
                            // console.log(`${id} ${first_name} ${last_name} ${manager_id}`);
                            managersArray.push(`${id} ${first_name} ${last_name}`)
                        }
                    }); return managersArray;
                }
            }
        ])
        .then((data) => {
            const managerData = data.manager;
            // Grabbing the first string using Regular Expression.
            const RolesId = managerData.replace(/ .*/,'');
            connection.query('SELECT * FROM employee WHERE ?', {
                manager_id: RolesId
            },
            (err, result) => {
                if (err) throw err;
                console.table(result);
                xRoad(); 
            }
            );
        })
    })   
}

// Need to join Department ID
const viewAllByBudgetSalary = () => {
    // SELECT * FROM employee RIGHT JOIN role ON employee.role_id = role.id WHERE first_name IS NOT NULL

    // RIGHT JOIN department ON role.department_id = department.id
    
    connection.query("SELECT department_id, SUM(salary) salary, department.name FROM role LEFT JOIN department ON role.department_id = department.id GROUP BY department_id", (err, result) => {
        if(err) throw err;
        console.table(result);
        xRoad()
    })   
}

// ------------------------- DELETE -------------------------

const removeEmployee = () => {
    connection.query('SELECT * FROM employee', (err, results) => {
    inquirer.prompt([
        {
            name: "choice",
            type: "rawlist",
            choices() {
                const choiceArray = [];
                results.forEach(({id, first_name, last_name}) => {
                    choiceArray.push(`${id} ${first_name} ${last_name}`);
                });
                return choiceArray;
            },
            message: "Choose employee would you like to delete.",
        }
    ])
    .then((answer) => {
        // Deconstructing the anwer
        let { choice } = answer;
        // Grabbing the first string using Regular Expression.
        const empId = choice.replace(/ .*/,'');
        connection.query('DELETE FROM employee WHERE ?', {
            id: empId
        },
        (err, result) => {
            if (err) throw err;
            console.log(`Employee ${choice} deleted in the database.\n`);
            xRoad(); 
        }
        );
    })
    })
};

const removeRole = () => {

    connection.query('SELECT * FROM role', (err, results) => {
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices() {
                    const choiceArray = [];
                    results.forEach(({title}) => {
                        choiceArray.push(title);
                    });
                    return choiceArray;
                },
                message: "Choose role would you like to delete.",
            }
        ])
        .then((answer) => {
            let { choice } = answer;
            
            connection.query('DELETE FROM role WHERE ?', {
                title: choice
            },
            (err, result) => {
                if (err) throw err;
                console.log(`Role ${choice} deleted in the database.\n`);
                xRoad(); 
            }
            );
        })
        }  
    )
}

const removeDepartment = () => {
    connection.query('SELECT * FROM department', (err, results) => {
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices() {
                    const choiceArray = [];
                    results.forEach(({name}) => {
                        choiceArray.push(name);
                    });
                    return choiceArray;
                },
                message: "Choose department would you like to delete. ",
            }
        ])
        .then((answer) => {
            let { choice } = answer;
            
            connection.query('DELETE FROM department WHERE ?', {
                name: choice
            },
            (err, result) => {
                if (err) throw err;
                console.log(`Deparment ${choice} deleted in the database.\n`);
                xRoad(); 
            }
            );
        })
        }  
    )

}

// ------------------------- ADD -------------------------

const addEmp = () => {
    connection.query('SELECT * FROM employee', (err, manager) => { 
        if (err) throw err;
    connection.query('SELECT * FROM role ', (err, roles) => {
        if (err) throw err;
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "New employee's first name? ",
        },
        {
            name: "lastName",
            type: "input",
            message: "New employee's last name? ",
        },
        {
            name: "role_title",
            type: "rawlist",
            message: "New employee's role? ",
            choices() {
                const roleArray = [];
                roles.forEach(({ id, title })=> {
                    roleArray.push(`${id} ${title}`)
                });
                return roleArray;
            },
        },
        {
            name: "manager_name",
            type: "rawlist",
            message: "New employee's manager? ",
            choices() {
                const managerArray = [];
                manager.forEach(({ id, first_name, last_name })=> {
                    managerArray.push(`${id} ${first_name} ${last_name}`)
                });
                return managerArray;
            },
        },
    ])
    .then((answer) => {
        const role = answer.role_title
        const roleAnswer = role.replace(/ .*/,'');
        const manager = answer.manager_name;
        const managerAnswer = manager.replace(/ .*/,'');
        const fname = answer.firstName;
        const lname = answer.lastName;

        connection.query('INSERT INTO employee SET ?', 
        {
            last_name: lname,
            first_name: fname,
            role_id: roleAnswer || 0,
            manager_id: managerAnswer || 0,
        },
        (error, res) => {
            if (err) throw err;
            console.log(`${fname} ${lname} has been updated to the kingdom!\n`)
            xRoad()
        }   
    );
    }) // Closing for .then, 😬
}) // Closing for Role Connection 
}) // Closing for Department connection
};

const addRole = () => {
    connection.query('SELECT * FROM department', (err, kingdom) => {
        if (err) throw err;
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Role name?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Salary?'
        },
        {
            name: 'kingdom',
            type: 'rawlist',
            message: 'Department name?',
            choices() {
                const departmentArray = [];
                kingdom.forEach(({ id, name}) => {
                    departmentArray.push(`${id} ${name}`) 
                });
            return departmentArray;
            }
        },
    ])
    .then((answer) => {
        const dept = answer.kingdom;
        const deptId = dept.replace(/ .*/, '');
        connection.query('INSERT INTO role SET ?',
        {
            title: answer.title,
            salary: answer.salary,
            department_id: deptId || 0, // || 0 == if value undefined or null it will return to 0
        },
        (err, result) => {
            if (err) throw err;
            console.log(`Role ${answer.title} has been added to the role.\n`)
            xRoad();
        }
        ) // INSERT CONNECTION 

    })
    }) // Select Role Connection
}

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Name of department',
        },
    ])
    .then((answer) => {
        connection.query('INSERT INTO department SET ?', 
        {
            name: answer.name,
        },
        (err, result) => {
            if (err) throw err;
            console.log(`${answer.name} is added to the depatment\n`);
            xRoad()
        })
        
    })
}

// ------------------------- Update -------------------------


const updateEmployeeRole = () => {
    connection.query('SELECT * FROM employee', (err, results) => {
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices() {
                    const choiceArray = [];
                    results.forEach(({id, first_name, last_name}) => {
                        choiceArray.push(`${id} ${first_name} ${last_name}`);
                    });
                    return choiceArray;
                },
                message: "Choose employee would you like to update the role.",
            }
        ])
        .then((answer) => {
            // Deconstructing the anwer
            let { choice } = answer;
            // Grabbing the first string using Regular Expression.
            const empId = choice.replace(/ .*/,'');
            // console.log(empId)
            connection.query('SELECT * FROM employee', (err, manager) => { 
                if (err) throw err;
            connection.query('SELECT * FROM role ', (err, roles) => {
                if (err) throw err;
                inquirer.prompt([
                {
                    name: "role_title",
                    type: "rawlist",
                    message: "New employee's role? ",
                    choices() {
                        const roleArray = [];
                        roles.forEach(({ id, title })=> {
                            roleArray.push(`${id} ${title}`)
                        });
                        return roleArray;
                    },
                
                },
            ])
            .then((answer) => {
                const role = answer.role_title
                const roleAnswer = role.replace(/ .*/,'');
                connection.query(
                    "UPDATE employee SET role_id = ? WHERE id = ?",
                    [   
                        roleAnswer, empId 
                    ],
                    (error) => {
                      if (error) throw error;
                      console.log("Success!");
                      xRoad();
                    }
                  );

            }) // Closing for .then, 😬
        }) // Closing for Role Connection 
        }) // Closing for Department connection
        })

        })

}

// Need to update manager stuff.
const updateEmployeeManager = () => {
    connection.query('SELECT * FROM employee', (err, results) => {
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices() {
                    const choiceArray = [];
                    results.forEach(({id, first_name, last_name}) => {
                        choiceArray.push(`${id} ${first_name} ${last_name}`);
                    });
                    return choiceArray;
                },
                message: "Choose employee would you like to delete.",
            }
        ])
        .then((answer) => {
            // Deconstructing the anwer
            let { choice } = answer;
            // Grabbing the first string using Regular Expression.
            const empId = choice.replace(/ .*/,'');
            connection.query('DELETE FROM employee WHERE ?', {
                id: empId
            },
            (err, result) => {
                if (err) throw err;
                console.log(`Employee ${choice} deleted in the database.\n`);
                xRoad(); 
            }
            );
        })
        })
}
