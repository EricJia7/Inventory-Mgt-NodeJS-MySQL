require("dotenv").config();

const listOfKeys = require("./keys.js");
const inquirer = require('inquirer');

//npm sequelize 
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
    logging: false
  });

const Products = sequelize.define('products',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
    },
    product_name: Sequelize.STRING,
    department_name:Sequelize.STRING,
    price: Sequelize.FLOAT,
    stock_quantity: Sequelize.INTEGER,
}, {
    timestamps:false,
});

function managerView() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Please select the operation',
            name: 'operation',
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product',
                'Log Out'
            ]
        },
    ]).then(ans => {
        let curOps = ans.operation;
        let runCommand = new Operation(curOps);
        runCommand.runOpearation();
    });
};

class Operation {
    constructor(command) {
        this.command = command
    }

    runOpearation() {
        if(this.command === 'View Products for Sale') {
            this.viewAllProd();
        } else if (this.command === 'View Low Inventory') {
            this.viewLowInvProd();
        } else if (this.command === 'Add to Inventory') {
            this.addInv();
        } else if (this.command === 'Add New Product') {
            this.addNewProd();
        } else if (this.command === 'Log Out') {
            this.logOut();
        }
    }

    viewAllProd() {
        Products.findAll().then((result) => {
            console.log('\n Here is the current inventory list \n');
            console.log('**************************************************************************************************************** \n');
            result.map((ele,index) => {
                console.log(ele.id + ' : ' + ele.product_name + ' , Qty: ' + ele.stock_quantity + ' , Price: ' + ele.price + '\n');
                if(index === result.length -1) {
                    console.log('****************************************************************************************************************');
                    managerView();
                };
            })
        });
    }

    viewLowInvProd() {
        let Op = Sequelize.Op;
        Products.findAll({
            where: {
                [Op.lte]: [5]
            }
        }).then((result) => {
            console.log(result)
        });
    }

    addInv() {
        Products.findAll().then((result) => console.log(JSON.stringify(result)));
    }

    addNewProd() {
        Products.findAll().then((result) => console.log(JSON.stringify(result)));
    }

    logOut() {
        sequelize.close();
    }

}

managerView();
