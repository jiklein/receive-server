// [WEBSERVER FILE]

// Define custom package imports
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

// Database import from the database folder
const database = require('./database/database.js')

// Port we are running the server on. Can be any free port.
const port = process.env.PORT || 4000;
// Create the ExpressJS object
var app = express();

app.use(cors())
app.use(bodyParser.json()); // for parsing application/json requests

// Give everyone access to our static directory 'public'
app.use(express.static(__dirname + '/public'));

// Whenever a client connects (and thus calling a GET request) to 'localhost:4000/', we will route them to index.html.
app.get('/', function (req, res) {
        res.sendFile('./public/index.html');
});



var UID = 10000000;

// Adds a customer to the database
app.get('/addcustomer', (req, res) => {
  const {username, password} = req.query;
  database.addUser(username, password, "C" + UID, res);
  UID += 1;
  database.printUsers();
});


// Adds a customer to the database
app.get('/addstore', (req, res) => {
  var {info} = req.query;
  info = JSON.parse(info);
  const SID = "S" + UID;
  UID += 1;
  database.addUser(info.username, info.password, SID);
  database.printUsers();

  // Add bid if it does not exist
  if (info.bid == '') {
    info.bid = "B" + UID;
    UID += 1;
    database.addBusiness(info.bid, info.name);
  }

  // Add store
  database.addStore(SID, info.bid, info.address, res);
});

// Adds a customer to the database
app.get('/addreceipt', (req, res) => {
  var {info} = req.query;
  info = JSON.parse(info);
  console.log(info);

  // Create RID
  const RID = "R" + UID;
  UID += 1;

  // Add transaction
  database.addTransaction(info.sid, info.cid, RID, "4/20", res);

  //database.addItems(RID, info.items, info.prices);

});

// Gets the uid from a user
app.get('/getuid', (req, res) => {
  const {username, password} = req.query;
  database.getUID(username, password, res);

  database.printUsers();
});

// Gets the uid from a user
app.get('/getallreceipts', (req, res) => {

  const {cid} = req.query;
  database.getAllReceipts(cid, res);

});

app.listen(port, () => {
        console.log(`[WEBSERVER]\tServer active on port ${port}`);
});

