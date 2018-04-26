
require("dotenv").config();

const listOfKeys = require("./keys.js");

const mysql = require('mysql');

const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host     : listOfKeys.mysql.host,
  user     : listOfKeys.mysql.user,
  password : listOfKeys.mysql.password,
  database : 'bamazon'
});

function showInventory() {
    connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          return;
        }
        console.log('connected as id ' + connection.threadId);
    }); 
    connection.query('SELECT * FROM products', function (err, result, fields) {
        if (err) throw err;
        console.log('Here is the current inventory list \n');
        result.map(function(ele){
            console.log(ele.id + ' : ' + ele.product_name + ' , Qty: ' + ele.stock_quantity + ' , Price: ' + ele.price + '\n');
        });
    });
    connection.end();
};

function getSingleItem(id) {
    connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          return;
        }
        console.log('connected as id ' + connection.threadId);
    }); 
    connection.query('SELECT * FROM `products` WHERE `id` =' + id, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
    connection.end();
}

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
        let prodID = ans.prodID;
        let prodQty = ans.prodQty;
        if(ans.isOrderPlaced) {
            getSingleItem(prodID);
        }
    });
}


showInventory();
custCheckOut()
