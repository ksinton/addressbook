var mysql = require('mysql');

var Connect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database : "addressbook",
    port: '8889',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
  });

module.exports = Connect;
