require("dotenv").config();

const listOfKeys = require("./keys.js");
const inquirer = require('inquirer');
const chalk = require('chalk');

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
    dialectOptions: {decimalNumbers: true},
    logging: false
  });

const Products = sequelize.define('products',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
    },
    product_name: Sequelize.STRING,
    department_name:Sequelize.STRING,
    price: {
        type:Sequelize.DECIMAL(10,3)
    },
    stock_quantity: Sequelize.INTEGER,
    product_sales: {
        type:Sequelize.DECIMAL(10,3)
    }
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
            console.log('************************************************************************************************************************** \n');
            result.map((ele,index) => {
                console.log(ele.id + ' : ' + ele.product_name + ' , Qty: ' + ele.stock_quantity + ' , Price: ' + ele.price + '\n');
                if(index === result.length -1) {
                    console.log('**************************************************************************************************************************');
                    managerView();
                };
            })
        });
    }

    viewLowInvProd() {

        inquirer.prompt([
            {
                type: 'input',
                message: 'Please input the qty of inventory(min): ',
                name: 'quantity',
            },
        ]).then(ans => {
            let qtyInput = parseInt(ans.quantity);
            let Op = Sequelize.Op;
            Products.findAll({
                where: {
                    stock_quantity: {
                        [Op.lte]: [qtyInput]
                    }
                }
            }).then((result) => {
                console.log('\n Here are the products which have inventory of less or equal to 5 \n');
                console.log('************************************************************************************************************************** \n');
                result.map((ele,index) => {
                    console.log(ele.id + ' : ' + ele.product_name + ' , Qty: ' + ele.stock_quantity + ' , Price: ' + ele.price + '\n');
                    if(index === result.length -1) {
                        console.log('**************************************************************************************************************************');
                        managerView();
                    };
                })
            });
        });
    }

    addInv() {
        inquirer.prompt([
            {
                type: 'input',
                message: 'What \'s ID of the product you want to add more inventory',
                name: 'productID',
            }
        ]).then(ans => {
            let idInput = ans.productID;
            Products.findAll({
                where: {
                    id: idInput
                }
            }).then((result) => {
                console.log('\n Current inventory for item# ' + idInput + ' is: ' + result[0].stock_quantity + '\n');
            }).then(() => {
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'Please input the qty you want to add to the inventory',
                        name: 'productQty',
                    }
                ]).then(ans => {
                    let qtyInput = parseInt(ans.productQty);
                    let Op = Sequelize.Op;
                    Products.findAll({
                        where: {
                            id: idInput
                        }
                    }).then((result) => {
                        result[0].stock_quantity = result[0].stock_quantity + qtyInput;
                        result[0].save();
                        console.log('\n Inventory has been updated and here is the updated info: \n');
                        console.log(result[0].id + ' : ' + result[0].product_name + ' , Qty: ' + result[0].stock_quantity + ' , Price: ' + result[0].price + '\n');
                        managerView();
                    })
                })
            });
        });
    }

    addNewProd() {
        inquirer.prompt([
            {
                type: 'input',
                message: 'What \'s ID of the product you want to add to the store?',
                name: 'productID',
            },
            {
                type: 'input',
                message: 'What \'s the product name?',
                name: 'productName',
            },
            {
                type: 'input',
                message: 'Which department is this item belongs to?',
                name: 'productDept',
            },
            {
                type: 'input',
                message: 'What \'s the selling price for this item?',
                name: 'productPrice',
            }, 
            {
                type: 'input',
                message: 'What \'s initial stock for this item?',
                name: 'productStock',
            }
        ]).then((ans) => {
            let [productID,productName, productDept, productPrice, productStock]= [ans.productID, ans.productName, ans.productDept, ans.productPrice, ans.productStock];
            Products.create({
                id: productID,
                product_name: productName,
                department_name: productDept,
                price: productPrice,
                stock_quantity: productStock,
            }).then(() => {
                Products.findAll({
                    where: {
                        id: productID
                    }
                }).then((result) => {
                    console.log('\n Item has been successfully added to store database \n');
                    console.log(result[0].id + ' : ' + result[0].product_name + ' , Qty: ' + result[0].stock_quantity + ' , Price: ' + result[0].price + '\n');
                    managerView();
                })
            })
        })
    }

    logOut() {
        sequelize.close();
    }

};

managerView();




