DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    id INTEGER(11) NOT NULL,
    product_name VARCHAR(255),
    department_name VARCHAR(30),
    price DECIMAL(10,3),
    stock_quantity INTEGER(11),
    product_sales DECIMAL(10,3),
    PRIMARY KEY(id)
);

INSERT INTO products(id, product_name, department_name, price, stock_quantity,product_sales)
VALUE(1234567,'Brain Quest Workbook: Pre-K','Book', 11.42, 10, 0),
(2345671,'Mosiso Water Repellent Lycra Sleeve Bag Cover for 15-15.6 Inch MacBook Pro','Computers & Accessories', 14.99, 55, 0),
(3456712,'Oral-B Glide 3D White Whitening plus Scope Radiant Mint Flavor Floss Twin Pack','Oral Care', 5.23, 16, 0),
(4567123,'Theefun 1:18 RTR RC Rock Crawler 2.4Ghz Remote Control Car 4WD Off Road RC Monster Truck','Toys & Games', 45.99, 66, 0),
(5671234,'NETGEAR CM500-1AZNAS (16x4) DOCSIS 3.0 Cable Modem','Electronics', 59.992, 45, 0),
(6712345,'Lab Series Daily Moisture Defense Lotion SPF 15, 3.4 oz','Beauty & Personal Care', 41.98, 2, 0),
(7123456,'Omron 10 Series Wireless Bluetooth Upper Arm Blood Pressure Monitor with Two User Mode','Health & Household', 60.99, 5, 0),
(1324567,'Trifield 100XE EMF Meter','Industrial & Scientific', 597.99, 10, 0),
(3245671,'Nest Learning Thermostat, Easy Temperature Control for Every Room in Your House, Stainless Steel (Third Generation)','Tool & Home Improvement', 222.45, 1000, 0),
(2456713,'Pampers Swaddlers Disposable Diapers Newborn Size 1 (8-14 lb), 148 Count, GIANT ','Baby', 29.28, 10, 0),
(4567132,'Set Of 36-Crayon Shaped Erasers-Assorted Colors. 2.5 Inch','Office Products', 7.35, 109, 0);


CREATE TABLE departments (
    department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30),
    over_head_costs DECIMAL(10,3),
    product_sales DECIMAL(10,3),
    PRIMARY KEY(department_id)
);

INSERT INTO departments(department_id, department_name, over_head_costs, product_sales)
VALUE(1234567,'Electronic',10000, 20000),
VALUE(1234567,'Clothing', 60000, 100000),
VALUE(1234567,'Gaming', 90000, 200000),
VALUE(1234567,'Food', 700000, 1000000),
VALUE(1234567,'Beverage', 200000, 220000),
