require("dotenv").config();

const listOfKeys = require("./keys.js");
const inquirer = require('inquirer');
const chalk = require('chalk');

// npm mysql
const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : listOfKeys.mysql.host,
    user     : listOfKeys.mysql.user,
    password : listOfKeys.mysql.password,
    database : 'bamazon'
  });

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

// npm mysql connect to mysql database
function connectDB() {
    connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          return;
        }
        console.log('connected as id ' + connection.threadId);
    }); 
};

function showInventory() {
    connectDB();
    connection.query('SELECT * FROM products', function (err, result, fields) {
        if (err) throw err;
        console.log(chalk.green('\n Here is the current inventory list \n'));
        console.log(chalk.blue('**************************************************************************************************************** \n'));
        result.map(function(ele,index){
            console.log(ele.id + ' : ' + ele.product_name + ' , Qty: ' + ele.stock_quantity + ' , Price: ' + ele.price + '\n');
            if(index === result.length -1) {
                console.log(chalk.blue('****************************************************************************************************************'));
                custCheckOut();
            };
        });
    });
    connection.end();
};

function getSingleItem1(id,qty) {
    connectDB();
    connection.query('SELECT * FROM `products` WHERE `id` =' + id, function (err, result, fields) {
        if (err) throw err;
        if(result[0].stock_quantity < qty) {
            console.log(chalk.red('\n Sorry, inventory runs low or Insufficient quantity \n'));
        }
    });
    connection.end();
};

function getSingleItem(id,qty) {
    Products.findById(id).then(result => {
        // console.log("~~~~~~~~~~~~~~" + JSON.stringify(result));
        if(qty > result.stock_quantity) {
            console.log('\n Sorry, inventory runs low or Insufficient quantity \n');
        } else {
            result.stock_quantity = result.stock_quantity - qty;
            result.product_sales = result.product_sales + qty*result.price;
            result.save();
            console.log('\n Item is in Stock!. You will be charged for ' + qty*result.price + ' dollars. \n')
        };
    }).then(() => {
        console.log('End of transaction! \n');
        custCheckOut();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
};

function custCheckOut() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What \'s ID of the product you want to buy?',
            name: 'productID'
        },
        {
            type: 'input',
            message: 'How many you want to buy?',
            name: 'productQty'  
        },
        {
            type: 'confirm',
            message: 'Confirm to place the order?',
            name: 'isOrderPlaced'
        }
    ]).then(ans => {
        let prodID = parseInt(ans.productID);
        let prodQty = parseFloat(ans.productQty);
        if(ans.isOrderPlaced) {
            getSingleItem(prodID,prodQty);
        }
    });
};

showInventory();




