require("dotenv").config();

const listOfKeys = require("./keys.js");
const inquirer = require('inquirer');
const chalk = require('chalk');
const Table = require('cli-table');

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
    Departments.findAll().then((result) => {
        let obj = result[0].dataValues;
        let tablehead = Object.keys(obj);
        tablehead.push('total_profit');
        let table = new Table({
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
            head: tablehead,
            colWidths: [20,20,20,20,20]
        });
        result.map(ele => {
            let eachDept = Object.values(ele.dataValues);
            eachDept.push(eachDept[2]*eachDept[3]);
            table.push(eachDept)
        });
        console.log('\n' + table.toString() + '\n');
    }).then(() => cliHub())
};

function createDepartment() {
    var deptName='';
    inquirer.prompt([
        {
            type: 'input',
            message: 'Please Enter the name of the department you want to add',
            name: 'name',
        },
        {
            type: 'input',
            message: 'Please Enter the initial total Over Head Cost for the department',
            name: 'cost',
        },
    ]).then(ans => {
        let departInput = [ans.name, ans.cost, 0, 0];
        deptName = departInput[0];
        Departments.create({
            department_name: departInput[0],
            over_head_costs: departInput[1],
            product_sales: departInput[2],
            total_profit: departInput[3],
        }).then(() => {
            viewDepartment();
        }).then(() => {
            console.log(chalk.green('\n' + deptName + ' has been successfully added to the department database!'));
        })
    })
};

function logout() {
    sequelize.close();
};

function cliHub() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Please select the operation below',
            name: 'operation',
            choices: [
                'View Product Sales by Department',
                'Create New Department',
                'Log Out'
            ]
        },
    ]).then(ans => {
        let operation = ans.operation;
        if(operation === 'View Product Sales by Department') {
            viewDepartment();
        } else if (operation === 'Create New Department') {
            createDepartment();
        } else if (operation === 'Log Out') {
            logout();
        }
    });
};

cliHub();