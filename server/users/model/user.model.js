const config = require('../../common/config/config.json');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const uri = config.database.host;
const client = new MongoClient(config.database.host);
const db = config.database.database;
const collection = config.database.admin;

exports.createUser = async (userData) => {
    let id = -1;
  
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      id = -2;
      const result = await client.db(db).collection(collection).insertOne(userData);
      console.log(`New user created with the following id: ${result.insertedId}`);
      id = result.insertedId;
    } catch (e) {
        console.error(e);
        id = e;
    } 
    return id;
};