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

exports.findByEmail = async (userEmail) => {
  await client.connect();
  const user = await client.db(db).collection(collection).findOne({email: userEmail});
  
  return user;
};

exports.findById = async (id) => {
  var result = null;
  try {
    // Connect to the MongoDB cluster
    await client.connect();
      const query = { _id: new ObjectId(id) };
      result = await client.db(db).collection(collection).findOne(query);
    
    if (result) {
        console.log(`Found a listing in the collection with the name '${id}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${id}'`);
    }
  } catch (e) {
    console.error(e);
  } 

  return result;
};

exports.list = async (perPage, page) => {
  var users = null;
    
  try {
    // Connect to the MongoDB cluster
    await client.connect();
  
    users = client.db(db).collection(collection).find().limit(perPage).skip(perPage * page).toArray();
    
    if (users) {
        console.log(`Found a listings : `);
    } else {
        console.log(`No listings found. `);
    }
        
  } catch (e) {
      console.error(e);
      users = e;
  } finally {
      // Close the connection to the MongoDB cluster
      //await this.client.close();
  }

  return users;
};

exports.patchUser = async (id, userData) => {
  
  var success = false;
    try {
      const query = { _id: new ObjectId(id) };
      const result = await client.db(db).collection(collection)
                          .findOneAndUpdate(query, { $set: userData });
  
      if(result.matchedCount > 0){
        success=true;
      }
    }
    catch (e) {
      console.error(e);
    }
    
    return success;
};

exports.removeById = async (userId) => {
  var success = false;
  
  try {

    //await client.connect();
    console.log('test');
    const query = { _id: new ObjectId(userId) };
    const result = await client.db(db).collection(collection)
            .deleteOne(query);
    console.log(result);
    if(result.deletedCount == 1) {
      success = true;
    }
    else {
      console.log(`Wrong number of users deleted.  Expecting 1 but ${result.deletedCount} where deleted`);
    }
  }
  catch (e) {
    console.log(`Error in Deleting user ${e}`);
    success = false
  }

  return success;
};