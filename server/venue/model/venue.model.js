const config = require('../../../env.config');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const uri = config.database.host;
const client = new MongoClient(config.database.host);
const db = config.database.database;
const collection = config.database.venue;

exports.list = async (perPage, page) => {
    var venue = null;
      
    try {
      // Connect to the MongoDB cluster
      await client.connect();
    
      venue = client.db(db).collection(collection).find().limit(perPage).skip(perPage * page).toArray();
                
    } catch (e) {
        console.error(e);
        venue = e;
    } 
  
    return venue;
  };

  exports.getPages = async(limit) => {
    var totalCount = null;
    var totalPages = null;
      
    try {
      // Connect to the MongoDB cluster
      await client.connect();
    
      totalCount = await client.db(db).collection(collection).countDocuments();
      console.log(`totalCount is ${totalCount}`);
      totalPages = Math.ceil(totalCount / limit); 
      console.log(`totalPages is ${totalPages}`);
    } catch (e) {
        console.error(e);
        venue = e;
    } 
  
    return {count: `${totalPages}`};
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

  exports.getAll = async () => {
    var venue = null;
      
    try {
      // Connect to the MongoDB cluster
      await client.connect();
    
      venue = client.db(db).collection(collection).find().toArray();
                
    } catch (e) {
        console.error(`error was ${e}`);
        venue = e;
    } 
  
    return venue;
  };

  exports.createVenue = async (venueData) => {
    let venue;
  
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      const result = await client.db(db).collection(collection).insertOne(venueData);
      console.log(`New venue created with the following id: ${result.insertedId}`);
      venue = result.insertedId;
    } catch (e) {
        console.error(e);
        venue = e;
    } 
    return venue;
};

exports.patchVenue = async (id, venueData) => {
    var success = false;
    try {
        const query = { _id: new ObjectId(id) };
        delete venueData._id;
        const result = client.db(db).collection(collection)
                        .findOneAndUpdate(query, { $set: venueData });
        success=true;
        
    }
    catch (e) {
        console.error(e);
    }
    
    return success;
};

exports.removeById = async (venueId) => {
    var success = false;
    
    try {
      const query = { _id: new ObjectId(venueId) };
      const result = await client.db(db).collection(collection)
              .deleteOne(query);
      if(result.deletedCount == 1) {
        success = true;
      }
      else {
        console.log(`Wrong number of venues deleted.  Expecting 1 but ${result.deletedCount} where deleted`);
      }
    }
    catch (e) {
      console.log(`Error in Deleting venue ${e}`);
      success = false
    }
  
    return success;
};

exports.removeByIds = async (venueIds) => {
  var success = false;
  
    try {
      const query = venueIds.map(id => new ObjectId(id));
      const result = await client.db(db).collection(collection)
              .deleteMany({ _id: { $in: query } });;
      console.log(`${result.deletedCount} document(s) was/were deleted.`);
      success = result.deletedCount;
    }
    catch (e) {
      console.log(`Error in Deleting Venues ${e}`);
      success = -1;
    }
  
    return success;
};

exports.removeByName = async (venueName) => {
  var success = false;
  
    try {
      const query = {name: venueName}
      const result = await client.db(db).collection(collection)
        .deleteOne(query);
      console.log(`${result.deletedCount} document(s) was/were deleted.`);
      success = result.deletedCount;
    }
    catch (e) {
      console.log(`Error in Deleting Venues ${e}`);
      success = -1;
    }
  
    return success;
};

exports.search = async (searchTerm) => {
    const regex = new RegExp(searchTerm, 'i');
    const result = await client.db(db).collection(collection).find({
      $or: [
        { name: regex },
        { summary: regex },
        { bedrooms: regex },
        { bathrooms: regex }
      ]
    }).toArray();
    
    if (result) {
        return result;
    } else {
        return null;
    }
};