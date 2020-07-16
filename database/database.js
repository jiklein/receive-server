var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./database/cme-data.db');

// Ensures that asynchronous db statements wait until their completion before proceeding
db.serialize(function () {

  // Clears table
  db.run('drop TABLE if exists users;');
  // Clears table
  db.run('drop TABLE if exists transactions;');
  // Clears table
  db.run('drop TABLE if exists store;');
  // Clears table
  db.run('drop TABLE if exists business;');

  // Creates table
  db.run("create table if not exists " +
    "users (username text, password text, uid text);");

  // Creates table
  db.run("create table if not exists " +
    "transactions (sid text, cid text, rid text, date text);");
  db.run("create table if not exists " +
    "store (sid text, bid text, address text);");
  db.run("create table if not exists " +
    "business (bid text, name text);");

  // Prints success
  console.log("[DATABASE]\tInitialized sqlite3 Database");

  // Adds a customer to the database
  module.exports.addUser = function(username, password, uid, res) {
    db.run('INSERT INTO users (username, password, uid) VALUES (?, ?, ?)',
      [username, password, uid],function(err, row){

        if (res != undefined) {
          res.json({
            data: "success"
          });
        }
      });
  }

  // Adds a customer to the database
  module.exports.addStore = function(sid, bid, address, res) {
    db.run('INSERT INTO store (sid, bid, address) VALUES (?, ?, ?)',
      [sid, bid, address],function(err, row){

        if (res != undefined) {
          res.json({
            data: "success"
          });
        }
      });
  }

  // Adds a customer to the database
  module.exports.addTransaction = function(sid, cid, rid, date, res) {
    db.run('INSERT INTO transactions (sid, cid, rid, date) VALUES (?, ?, ?, ?)',
      [sid, cid, rid, date],function(err, row){

        if (res != undefined) {
          res.json({
            data: "success"
          });
        }
      });
  }

  // Adds a customer to the database
  module.exports.addBusiness = function(bid, name, res) {
    db.run('INSERT INTO business (bid, name) VALUES (?, ?)',
      [bid, name],function(err, row){

        if (res != undefined) {
          res.json({
            data: "success"
          });
        }
      });
  }

  // Gets the UID for a particular user
  module.exports.getUID = function(username, password, res) {
    db.get("SELECT * FROM users where username=? and password=?",
      [username, password],function (err, row) {

        // Check empty
        if (row == undefined) {
          res.json({
            data: "failure"
          });

        // Else send data
        } else {
          res.json({
            data: row.uid
          });
        }
      });
  }

  // Gets the UID for a particular user
  module.exports.getAllReceipts = function(cid, res) {
    db.all("SELECT b.name as name, t.date as date, t.rid as rid " +
      "FROM transactions t, store s, business b " +
      "where t.cid=? and t.sid = s.sid and s.bid = b.bid",
      [cid],function (err, rows) {

        console.log(err);
        // Check empty
        if (rows == undefined) {
          res.json({
            data: "failure"
          });

        // Else send data
        } else {

          var arr = [];

          rows.forEach((row) => {
            arr.push({
              business: row.name,
              date: row.date,
              rid: row.rid
            });
          });

          res.json({
            data: arr
          });
        }
      });
  }

  module.exports.printUsers = function () {
    // This just prints all rows
    db.each('SELECT username, password, uid FROM users', function (err, row) {
      console.log("[DATABASE]\tRow " + row.username + ": " + row.password + "\t" + row.uid);
    });
  }
});
