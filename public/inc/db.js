const mysql = require('mysql2');
 
// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'caique',
  database: 'saboroso',
  password:'024UF971gd@',
  multipleStatements:true
});

module.exports = connection;