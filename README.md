# Inventory-Mgt-NodeJS-MySQL

## Description

* This application provide a command line interface for Customer, Manager and Supervisor to check out and manage inventories. 

## Prerequiremnt

* Need to install mysql. Use bamazon.sql to create table of products and departments. 
* Need to install node.js. 
* Need to install npm install of all the dependencies in the package.json. 
* Need to create an .env file and add credentials of your SQL as 
    * HOST = {your localhost name}
    * MYSQL_PASSWORD = {your password}
    * USER= {your username}
 
## How to run

* Customer Interface 
    * In node command line interface, 'node bamazonCustomer.js' to access the interface portal for Customer. 
    * It will allow customer to view the inventory and check out products. 

* Manager Interface 
    * In node command line interface, 'node bamazonManager.js' to access the interface portal for Manager. 
    * The Manager will have access for the following
        1. View Products for Sale 
        2. View Low Inventory 
        3. Add to Inventory 
        4. Add New Product
        5. Log out 

* Supervisor Interface 
    * In node command line interface, 'node bamazonSupervisor.js' to access the interface portal for Supervisor. 
    * It will allow Supervisor to View Product Sales by Department and Add new Department. 






