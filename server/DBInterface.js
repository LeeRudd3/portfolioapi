const config = require('../etc/secrets/config.json');
const bodyParser = require('body-parser');

const express = require("express");
const { MongoClient, ObjectId } = require('mongodb');

const path = require('path');
const app = express();

let uri;
let client;
let db;
let collection;

class DBInterface {

  constructor(uri, client, db, collection) {
    this.uri = uri;
    this.client = client;
    this.db = db;
    this.collection = collection;
  }
    
  add(number1, number2) {
      return number1 + number2;
  }

  async listDB() {
              
    let list = '';
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        list = await this.listDatabases(client);
        console.log(`DB List - ${list}`);
    } catch (e) {
        console.error(e);
        list = e;
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
    return list;
  }
      
  async listDatabases(client) {
    let list = 'DataBases ';

    let databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
      list = list + ` - ${db.name}`;
    });

    return list;
  };

  async createNewListing(newListing) {
    let id = -1;
  
    try {
      // Connect to the MongoDB cluster
      await this.client.connect();
      id = -2;
      // Make the appropriate DB calls
      //id = await createListing(client, newListing);
      const result = await this.client.db(this.db).collection(this.collection).insertOne(newListing);
      console.log(`New listing created with the following id: ${result.insertedId}`);
      id = result.insertedId;
    } catch (e) {
        console.error(e);
        id = e;
    } finally {
        // Close the connection to the MongoDB cluster
        //await this.client.close();
    }
    return id;
  }

  async getListings(numberOfListings) {
    var listings = null;
    
    try {
      // Connect to the MongoDB cluster
      await this.client.connect();
      // Make the appropriate DB calls
      //listings = await findListings(client, numberOfListings);

      const projection = {
        _id: 1,  // Exclude the '_id' field
        name: 1,
        summary: 1,
        bedrooms: 1,
        bathrooms: 1
      };
    
      listings = this.client.db(this.db).collection(this.collection).find().project(projection).limit(numberOfListings).toArray();
      
      if (listings) {
          console.log(`Found a listings : `);
          //return result;
      } else {
          console.log(`No listings found. `);
          //return null;
      }
          
    } catch (e) {
        console.error(e);
        listings = e;
    } finally {
        // Close the connection to the MongoDB cluster
        //await this.client.close();
    }
  
    return listings;
  }
  
  async getListingByID(idOfListing) {
    var result = null;
    try {
      // Connect to the MongoDB cluster
      await this.client.connect();
      if (idOfListing.hasOwnProperty("_id")) {
        const query = { _id: new ObjectId(idOfListing["_id"]) };
        result = await this.client.db(this.db).collection(this.collection).findOne(query);
      }
      else {
        result = await this.client.db(this.db).collection(this.collection).findOne(idOfListing);
      }
      if (result) {
          console.log(`Found a listing in the collection with the name '${idOfListing}':`);
          console.log(result);
          return result;
      } else {
          console.log(`No listings found with the name '${idOfListing}'`);
          return null;
      }
    } catch (e) {
      console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        //await this.client.close();
    }
  }
  
  async getListingBySearch(searchTerm) {
    var id = null;
    
    try {
      // Connect to the MongoDB cluster
      await this.client.connect();
      id = -2;
      // Make the appropriate DB calls
      id = await this.findListing(searchTerm);
          
    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        await this.client.close();
    }
  
    return id;
  }
  
  async findListing(searchTerm) {
    
    const regex = new RegExp(searchTerm, 'i');
    const result = await this.client.db(this.db).collection(this.collection).find({
      $or: [
        { name: regex },
        { summary: regex },
        { bedrooms: regex },
        { bathrooms: regex }
      ]
    }).toArray();
    
    if (result) {
        console.log(`Found a listing in the collection with the name '${searchTerm}':`);
        console.log(result);
        return result;
    } else {
        console.log(`No listings found with the name '${searchTerm}'`);
        return null;
    }
  }

  async updateListingByID(idOfListing, updatedListingData) {
    var success = false;
    try {
      const query = { _id: new ObjectId(idOfListing) };
      const result = await this.client.db(this.db).collection(this.collection)
                          .updateOne(query, { $set: updatedListingData });
  
      if(result.matchedCount > 0){
        success=true;
      }
    }
    catch (e) {
      console.error(e);
    }
    
    return success;
  }
  
  async editListingByID(idOfListing, updatedListingData) {
    var success = false;
    
    try {
      // Connect to the MongoDB cluster
      await this.client.connect();
      // Make the appropriate DB calls
      success = await this.updateListingByID(idOfListing, updatedListingData);
          
    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        await this.client.close();
    }
  
    return success;
  }

  async remomeListingByID(idOfListing) {
    var success = false;
  
    try {
      const query = { _id: new ObjectId(idOfListing) };
      const result = await this.client.db(this.db).collection(this.collection)
              .deleteOne(query);
      console.log(result);
      if(result.deletedCount == 1) {
        success = true;
      }
      else {
        console.log(`Wrong number of listing deleted.  Expecting 1 but ${result.deletedCount} where deleted`);
      }
    }
    catch (e) {
      console.log(`Error in Deleting Listing ${e}`);
      success = false
    }
  
    return success;
  }
  
  async remomeListingsByID(idOfListings) {
    var success = false;
  
    try {
      const query = idOfListings.map(id => new ObjectId(id));
      const result = await this.client.db(this.db).collection(this.collection)
              .deleteMany({ _id: { $in: query } });;
      console.log(`${result.deletedCount} document(s) was/were deleted.`);
      success = result.deletedCount;
    }
    catch (e) {
      console.log(`Error in Deleting Listing ${e}`);
      success = -1;
    }
  
    return success;
  }

  async remomeListingsByName(nameOfListings) {
    var success = false;
  
    try {
      //const query = nameOfListings.map(name => name);
      const result = await this.client.db(this.db).collection(this.collection)
              .deleteMany({ name: { $in: nameOfListings } });;
      console.log(`${result.deletedCount} document(s) was/were deleted.`);
      success = result.deletedCount;
    }
    catch (e) {
      console.log(`Error in Deleting Listing ${e}`);
      success = -1;
    }
  
    return success;
  }
  
  async deleteListingByID(idOfListing) {
    var success = false;
    
    try {
      // Connect to the MongoDB cluster
      await this.client.connect();
      // Make the appropriate DB calls
      success = await this.remomeListingByID(idOfListing);
          
    } catch (e) {
        console.error(e);
        dblist = e;
    } finally {
        // Close the connection to the MongoDB cluster
        await this.client.close();
    }
  
    return success;
  }
  
  async deleteListingsByID(idOfListings) {
    var success = false;
    
    try {
      // Connect to the MongoDB cluster
      await this.client.connect();
      // Make the appropriate DB calls
      success = await this.remomeListingsByID(idOfListings);
          
    } catch (e) {
        console.error(e);
        dblist = e;
    } finally {
        // Close the connection to the MongoDB cluster
        //this.client.close();
    }
  
    return success;
  }

  async deleteListingsByName(nameOfListings) {
    var success = false;
    
    try {
      // Connect to the MongoDB cluster
      await this.client.connect();
      // Make the appropriate DB calls
      success = await this.remomeListingsByName(nameOfListings);
          
    } catch (e) {
        console.error(e);
        dblist = e;
    } finally {
        // Close the connection to the MongoDB cluster
        //this.client.close();
    }
  
    return success;
  }
  
}

module.exports = DBInterface;