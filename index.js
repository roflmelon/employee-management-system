require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const menuQuestions = require('./lib/menuQuestions.js');
const {
  validateId,
  validateName,
  validateInput,
} = require('./helpers/validate');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: 'business_db',
  },
  console.log('Connected to business_db database.')
);

function mainMenu() {
  inquirer.prompt(menuQuestions).then((answer) => {
    if (answer.mainMenu === 'View All Employees') {
      viewAllEmployees();
    } else if (answer.mainMenu === 'View All Roles') {
      viewAllRoles();
    } else if (answer.mainMenu === 'View All Departments') {
      viewAllDepartments();
    } else if (answer.mainMenu === 'Add Employee') {
      addEmployee();
    } else if (answer.mainMenu === 'Add Role') {
      addRole();
    } else if (answer.mainMenu === 'Add Department') {
      addDepartment();
    } else if (answer.mainMenu === 'Update Employee Role') {
      updateEmployeeRole();
    } else if (answer.mainMenu === 'Exit') {
      console.log('Good Bye!!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
}

async function viewAllEmployees() {
  await db
    .promise()
    .query(
      `SELECT employee.id AS "ID", first_name AS "First Name", last_name as "Last Name", role.title AS "Title" FROM employee INNER JOIN role ON employee.role_id=role.id ORDER BY employee.id ASC`
    )
    .then(([rows]) => {
      console.log('\n');
      console.table(rows);
    })
    .catch((err) => console.log(err));
  mainMenu();
}

async function viewAllRoles() {
  await db
    .promise()
    .query(
      `SELECT role.id AS "ID", Title AS "Title", salary as "Salary", department.name AS "Department" FROM role INNER JOIN department ON role.department_id=department.id ORDER BY role.title ASC`
    )
    .then(([rows]) => {
      console.log('\n');
      console.table(rows);
    })
    .catch((err) => console.log(err));
  mainMenu();
}

async function viewAllDepartments() {
  await db
    .promise()
    .query(`SELECT id AS "ID", name AS "Department" FROM department`)
    .then(([rows]) => {
      console.log('\n');
      console.table(rows);
    })
    .catch((err) => console.log(err));
  mainMenu();
}

async function addEmployee() {
  const [roles] = await db
    .promise()
    .query(`SELECT title, id FROM role`)
    .catch((err) => console.log(err));

  const [employees] = await db
    .promise()
    .query(`SELECT CONCAT(first_name," ",last_name) AS name, id FROM employee`)
    .catch((err) => console.log(err));

  let rolesParsed = [];
  for (let i = 0; i < roles.length; i++) {
    rolesParsed.push(roles[i].title);
  }

  let managerNames = [];
  for (let i = 0; i < employees.length; i++) {
    managerNames.push(employees[i].name);
  }

  await inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'What is the first name of the employee?',
        validate: validateName,
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'What is the last name of the employee?',
        validate: validateName,
      },
      {
        type: 'list',
        name: 'role',
        message: `Select the employee's role`,
        choices: rolesParsed,
      },
      {
        type: 'list',
        name: 'manager',
        message: `Select the employee's manager`,
        choices: managerNames,
      },
    ])
    .then((answer) => {
      const { firstName, lastName, role, manager } = answer;
      const manager_id = employees
        .filter((emp) => emp.name === manager)
        .map((emp) => emp.id);

      const role_id = roles
        .filter((rol) => rol.title === role)
        .map((role) => role.id);

      db.promise()
        .query(
          `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES('${firstName}', "${lastName}", ${role_id}, ${manager_id})`
        )
        .then(console.log('\nEmployee Added Successfully\n'))
        .catch((err) => console.log('Could not add new employee: ' + err));
    })
    .catch((err) => console.log(err));
  mainMenu();
}

async function addRole() {
  const [department] = await db
    .promise()
    .query(`SELECT * FROM department`)
    .catch((err) => console.log(err));

  let departmentNames = [];
  for (let i = 0; i < department.length; i++) {
    departmentNames.push(department[i].name);
  }

  await inquirer
    .prompt([
      {
        type: 'input',
        name: 'roleTitle',
        message: 'What is the title of the new role?',
        validate: validateName,
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of this role?',
        validate: validateId,
      },
      {
        type: 'list',
        name: 'departSelect',
        message: `Select the department which the role belongs to`,
        choices: departmentNames,
      },
    ])
    .then((answer) => {
      const { roleTitle, salary, departSelect } = answer;
      const department_id = department
        .filter((dep) => dep.name === departSelect)
        .map((dep) => dep.id);

      console.log(departSelect);
      console.log(department_id);

      db.promise()
        .query(
          `INSERT INTO role (title, salary, department_id) VALUES('${roleTitle}', "${salary}", ${department_id})`
        )
        .then(console.log('\nNew Role Added Successfully\n'))
        .catch((err) => console.log('Could not add new role: ' + err));
    })
    .catch((err) => console.log(err));
  mainMenu();
}

async function addDepartment() {
  await inquirer
    .prompt([
      {
        type: 'input',
        name: 'department',
        message: 'What is the new department being added?',
        validate: validateName,
      },
    ])
    .then((answer) => {
      db.promise()
        .query(`INSERT INTO department (name) VALUES('${answer.department}')`)
        .then(console.log('\nNew Department Added Successfully\n'))
        .catch((err) => console.log('Could not add new department: ' + err));
    })
    .catch((err) => console.log(err));
  mainMenu();
}

async function updateEmployeeRole() {
  const [roles] = await db
    .promise()
    .query(`SELECT title, id FROM role`)
    .catch((err) => console.log(err));

  const [employees] = await db
    .promise()
    .query(`SELECT CONCAT(first_name," ",last_name) AS name, id FROM employee`)
    .catch((err) => console.log(err));

  let rolesParsed = [];
  for (let i = 0; i < roles.length; i++) {
    rolesParsed.push(roles[i].title);
  }

  let employeeList = [];
  for (let i = 0; i < employees.length; i++) {
    employeeList.push(employees[i].name);
  }

  await inquirer
    .prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Select an employee to update role:',
        choices: employeeList,
      },
      {
        type: 'list',
        name: 'newRole',
        message: 'Which new role is the employee assigned to?',
        choices: rolesParsed,
      },
    ])
    .then((answer) => {
      console.log(answer);
      const { employee, newRole } = answer;

      const employee_id = employees
        .filter((emp) => emp.name === employee)
        .map((emp) => emp.id);

      const role_id = roles
        .filter((rol) => rol.title === newRole)
        .map((role) => role.id);

      db.promise()
        .query(
          `UPDATE employee SET role_id = ${role_id} WHERE employee.id = ${employee_id};`
        )
        .then(console.log('\nEmployee Updated Successfully\n'))
        .catch((err) => console.log('Could not update employee: ' + err));
    })
    .catch((err) => console.log(err));
  mainMenu();
}

mainMenu();
