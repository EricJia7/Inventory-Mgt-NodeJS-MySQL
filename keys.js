console.log('MySQL keys have been loaded');

exports.mysql = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.MYSQL_PASSWORD,
};
