const config = require('../../../env.config');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const uri = config.database.host;
const client = new MongoClient(config.database.host);
const db = config.database.database;
const collection = config.database.bands

exports.list = async (perPage, page) => {
    var bands = null;
      
    try {
      // Connect to the MongoDB cluster
      await client.connect();
    
      bands = client.db(db).collection(collection).find().limit(perPage).skip(perPage * page).toArray();
               
    } catch (e) {
        console.error(e);
        users = e;
    } 
  
    return bands;
  };

  exports.findById = async (id) => {
    var result = null;
    try {
      
      await client.connect();
        const query = { _id: new ObjectId(id) };
        result = await client.db(db).collection(collection).findOne(query);
      
    } catch (e) {
      console.error(e);
    } 
  
    return result;
  };

  exports.createBand = async (bandData) => {
    let band;
  
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      const result = await client.db(db).collection(collection).insertOne(bandData);
      console.log(`New band created with the following id: ${result.insertedId}`);
      band = result.insertedId;
    } catch (e) {
        console.error(e);
        band = e;
    } 
    return band;
};

exports.patchUser = async (id, bandData) => {
    var success = false;
    try {
        const query = { _id: new ObjectId(id) };
        const result = await client.db(db).collection(collection)
                        .findOneAndUpdate(query, { $set: bandData });

        if(result.matchedCount > 0){
            success=true;
        }
    }
    catch (e) {
        console.error(e);
    }
    
    return success;
};

exports.removeById = async (bandId) => {
    var success = false;
    
    try {
      const query = { _id: new ObjectId(bandId) };
      const result = await client.db(db).collection(collection)
              .deleteOne(query);
      if(result.deletedCount == 1) {
        success = true;
      }
      else {
        console.log(`Wrong number of bands deleted.  Expecting 1 but ${result.deletedCount} where deleted`);
      }
    }
    catch (e) {
      console.log(`Error in Deleting band ${e}`);
      success = false
    }
  
    return success;
};