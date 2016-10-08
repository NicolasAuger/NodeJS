#!/usr/bin/env node
const chalk = require('chalk');

console.log(chalk.blue('Hello world!'));
const inquirer = require('inquirer')

inquirer.prompt([
  {
    type: 'input',
    message: 'Votre nom',
    name: 'pseudo'
  }, {
    type: 'checkbox',
    message: 'Qui est la plus belle ?',
    name: 'fille',
    choices: [
      'Manon',
      'Manon',
      'Manon'
    ]
  }
]).then((answers) => {
  console.log(answers);
})
