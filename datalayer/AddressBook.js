var Connection = require('./Connect.js');
var Promise    = require('promise');

  Connection.connect(function(err) {
    if (err) {
       console.log("ERROR: Unable to connect to mysql");
     } else {
       console.log("Connected");
    }
  });

var AddressBook = function() {

    this.createUserAccount = function(name, username, hashedPassword) {

      var sql = "INSERT INTO user (name, username, password) VALUES ("+ Connection.escape(name) +", "+ Connection.escape(username) +", '"+ hashedPassword +"')";

      var addUserPromise = new Promise(function (resolve, reject) {

        Connection.query(sql, function (error, result) {
          if (error) {
            console.log(error);
            reject(error)
          } else {
            resolve();
          }
        });

      });

      return addUserPromise;

    }

    this.getAccountPassword = function(username) {

      var sql = "SELECT userId, password FROM user WHERE username = "+ Connection.escape(username);

      var accountPasswordPromise = new Promise(function (resolve, reject) {

        Connection.query(sql, function (error, result) {
          if (error) {
            console.log(error);
            reject(error)
          } else {
            var loginResponse = result[0]
            resolve(loginResponse);
          }
        });
      });

      return accountPasswordPromise;

    }

    this.createContact = function(firstName, lastName, phone, userId) {

      var sql = "INSERT INTO contact (firstName, lastName, phone, fk_userId) values  ("+ Connection.escape(firstName) +", "+ Connection.escape(lastName) +", "+ Connection.escape(phone) +", "+ userId + ")";

      var addContactPromise = new Promise(function (resolve, reject) {

        Connection.query(sql, function (error, result) {
          if (error) {
            console.log(error);
            reject(error)
          } else {
            resolve();
          }
        });

      });

      return addContactPromise;

    }


    this.deleteContact = function(contactId) {

      var sql = "DELETE FROM contact WHERE contactId = " + contactId;

      var deleteContactPromise = new Promise(function (resolve, reject) {

        Connection.query(sql, function (error, result) {
          if (error) {
            console.log(error);
            reject(error)
          } else {
            console.log("result",result.affectedRows);
            resolve(result.affectedRows);
          }
        });

      });

      return deleteContactPromise;

    }


}

module.exports = AddressBook;
