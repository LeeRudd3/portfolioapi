// server/index.js
const config = require('../config.json');
const bodyParser = require('body-parser');
const DBInterface = require('./DBInterface');
const express = require("express");
const { MongoClient, ObjectId } = require('mongodb');



const PORT = process.env.PORT || config.server.port;

const path = require('path');
const app = express();

const dbInterface = new DBInterface(config.database.host, 
  new MongoClient(config.database.host),
  config.database.database,
  config.database.collection);


// Define an array of random texts.
const randomTexts = [
  'Hello, World!',
  'This is a random text.',
  'Press the button for more randomness!',
];

// Have Node serve the files for our built React app
//app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(bodyParser.json());

app.get("/api", (req, res) => {
  const randomIndex = Math.floor(Math.random() * randomTexts.length);
  const randomText = randomTexts[randomIndex];
  console.log(randomText);
  res.json({ message: randomText });
});

app.get("/listdb", (req, res) => {
  (async () => {
    list = await dbInterface.listDB();
    res.json({ message: list });
  })();
  
});

app.delete("/listing", (req, res) => {
  const idOfListing = req.query.id;
  (async () => {
    const success = await dbInterface.deleteListingByID(idOfListing);
    res.json({ message: success });
  })();
});

app.delete("/listings", (req, res) => {
  const idOfListings = req.body.ids;
  console.log(idOfListings);
  (async () => {
    const success = await dbInterface.deleteListingsByID(idOfListings);
    res.json({ message: success });
  })();
});

app.delete("/listings/name", (req, res) => {
  const nameOfListings = req.body.ids;
  (async () => {
    const success = await dbInterface.deleteListingsByName(nameOfListings);
    res.json({ message: success });
  })();
});

app.patch("/listing", (req, res) => {
  const updatedListingData = req.body;
  const idOfListing = req.query.id;
  (async () => {
    const success = await dbInterface.editListingByID(idOfListing, updatedListingData);
    res.json({ message: success });
  })();
});

app.post("/listing", (req, res) => {
  const newData = req.body;
  
  (async () => {
    const id = await dbInterface.createNewListing(newData);
    res.json({ message: id });
  })();
});

app.get("/listing", (req, res) => {
  var u = req.body;
  const argData = JSON.parse(req.query.search);
  console.log(`The query item is : ${argData['id']}`);
  (async () => {
    const id = await dbInterface.getListingByID(argData);
    res.json({ message: id });
  })();
});

app.get("/listings", (req, res) => {
  const argData = JSON.parse(req.query.limit);
  (async () => {
    const id = await dbInterface.getListings(argData);
    res.json(id);
  })();
});

app.get("/search", (req, res) => {
  const argData = req.query.search;
  (async () => {
    const id = await dbInterface.getListingBySearch(argData);
    res.json(id);
  })();
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  const randomText = "Didn't find call";
  console.log(randomText);
  res.json({ message: randomText });
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = {
  //listDB,
  //listDatabases,
  //createNewListing,
  //createListing,
  //findListings,
  //findOneListingByID,
  //updateListingByID,
  //remomeListingByID,
  //remomeListingsByID
};