// TODO: Include packages needed for this application
const fs = require('fs');
const generateMarkdown = require('./utils/generateMarkdown');
const inquirer = require('inquirer');

// TODO: Create an array of questions for user input
const questions = [
  {
    type: 'input',
    name: 'title',
    message: 'What is your project title?',
  },
  {
    type: 'input',
    name: 'description',
    message: 'Describe your project: (Divide descriptions with >>>>)',
  },
  {
    type: 'confirm',
    message: 'Do you want a table of content?',
    name: 'tableOfContent',
    radio: true,
    choices: ['Yes', 'No'],
  },
  {
    type: 'input',
    name: 'installation',
    message:
      'What are the installation steps for your project? (Divide steps with >>>>)',
  },
  {
    type: 'input',
    name: 'contribute',
    message:
      'Give instructions on how to contribute to the project: (Divide steps with >>>>)',
  },
  {
    type: 'input',
    name: 'testing',
    message:
      'Give instructions on how to test this project: (Divide steps with >>>>)',
  },
  {
    type: 'input',
    name: 'usage',
    message: 'What is the usage of this project? (Divide steps with >>>>)',
  },
  {
    type: 'list',
    name: 'license',
    message: 'Choose a license for your project:',
    choices: ['MIT', 'GNU GPLv3', 'ISC', 'Apache 2.0'],
  },
  {
    type: 'input',
    name: 'credits',
    message:
      'List all credits you want to give for this project: (Divide contributors with >>>>)',
  },
  {
    type: 'input',
    name: 'github',
    message: 'What is your github username?',
  },
  {
    type: 'input',
    name: 'email',
    message:
      'What is your email for contact in case of additional questions and concerns?',
  },
];
const fileName = 'README.md';
// TODO: Create a function to write README file
function writeToFile(fileName, data) {
  fs.writeFile(fileName, data, (error) =>
    error ? console.log(error) : console.log('File Created!')
  );
}

// TODO: Create a function to initialize app
function init() {
  inquirer.prompt(questions).then((data) => {
    let markDown = generateMarkdown(data);
    writeToFile(fileName, markDown);
  });
}

// Function call to initialize app
init();
