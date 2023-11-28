const config = require('../../common/config/env.config');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const uri = config.database.host;
const client = new MongoClient(config.database.host);
const db = config.database.database;
const collection = config.database.collection

exports.list = async (perPage, page) => {
    var bands = null;
      
    try {
      // Connect to the MongoDB cluster
      await client.connect();
    
      bands = client.db(db).collection(collection).find().limit(perPage).skip(perPage * page).toArray();
      
      if (bands) {
          console.log(`Found a listings : `);
      } else {
          console.log(`No listings found. `);
      }
          
    } catch (e) {
        console.error(e);
        users = e;
    } 
  
    return bands;
  };