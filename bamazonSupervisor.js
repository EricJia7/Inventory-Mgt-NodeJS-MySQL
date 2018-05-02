require("dotenv").config();

const listOfKeys = require("./keys.js");
const inquirer = require('inquirer');
const chalk = require('chalk');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('bamazon', listOfKeys.mysql.user, listOfKeys.mysql.password, {
    host: listOfKeys.mysql.host,
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {decimalNumbers: true},
    logging: false
  });

const Departments = sequelize.define('departments',{
    department_id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
    },
    department_name:Sequelize.STRING,
    over_head_costs: {
        type:Sequelize.DECIMAL(10,3)
    },
    product_sales: {
        type:Sequelize.DECIMAL(10,3)
    }
}, {
    timestamps:false,
});


function viewDepartment() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Please select the operation below',
            name: 'operation',
            choices: [
                'View Product Sales by Department',
                'Create New Department',
            ]
        },
    ]).then(ans => {
        let operation = ans.operation;
        if(operation === 'View Product Sales by Department') {
            console.log(chalk.blue("Hello, world!"));
        }
    });
};

viewDepartment();