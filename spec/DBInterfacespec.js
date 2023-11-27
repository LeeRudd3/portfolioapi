const DBInterface = require('../server/common/services/DBInterface'); // Adjust the path to your DBInterface class
//const config = require('../config.json');
//const { MongoClient } = require('mongodb');
//const jasmine = require('jasmine');

describe('DBInterface', () => {
    let dbInterface;
    let client;
    
    function mockGetListing() {
        returnthis = {
            databases: [
                { name: 'bandbook', sizeOnDisk: 73728, empty: false },
                { name: 'admin', sizeOnDisk: 335872, empty: false },
                { name: 'local', sizeOnDisk: 1281781760, empty: false }
            ]};     
        client = {
            db: jasmine.createSpy('db').and.returnValue({
                admin: jasmine.createSpy('admin').and.returnValue({
                    listDatabases: jasmine.createSpy('listDatabases').and.returnValue(    
                        Promise.resolve(returnthis)
                    ),
                }),
            }),
            connect: jasmine.createSpy('connect').and.returnValue(Promise.resolve()),
            close: jasmine.createSpy('close').and.returnValue(Promise.resolve()),

        };

        dbInterface = new DBInterface("test", client, "test", "test");
    };

    it('should list databases', async () => {
        mockGetListing();
        const result = await dbInterface.listDatabases(client);
        expect(result).toContain('DataBases');
        expect(result).toBe("DataBases  - bandbook - admin - local");
    });
});

describe("CreateNewListing ", () => {
    let dbInterface;
    let client;
    
    beforeEach(() => {
    
        // Create a mock client
        client = {
            db: jasmine.createSpy('db').and.returnValue({
                collection: jasmine.createSpy('collection').and.returnValue({
                    insertOne: jasmine.createSpy('insertOne').
                    and.returnValue(Promise.resolve({insertedId: 'Insertion successful'})),
                }),
            }),
            connect: jasmine.createSpy('connect').and.returnValue(Promise.resolve()),
            close: jasmine.createSpy('close').and.returnValue(Promise.resolve()),

        };

        // Initialize newListing with your test data
        jsonData = { name: `listingTest`,
        summary: `This is a jasmine Test`,
        bedrooms: `3`,
        bathrooms: `2` };

        dbInterface = new DBInterface("test", client, "test", "test");
    });

    it("Creates new listing with createListing", async () => {
        //let dbInterface = new DBInterface();
        const result = await dbInterface.createNewListing(jsonData);
        expect(result).not.toBeNull();
        expect(result).toBe('Insertion successful');
    });
});

describe("find a list of listings ", () => {
    let dbInterface;
    let client;

    beforeEach(() => {
        jsonList = [
            {
                _id: "6515af6e06454f70b41123f7",
                name: "apiedittest",
                summary: "A charming loft in the outskirts of Portland",
                bedrooms: "5",
                bathrooms: "1"
            },
            {
                _id: "651f161e0425e8f76cec81ea",
                name: "1",
                summary: "1",
                bedrooms: "1",
                bathrooms: "1"
            },
            {
                _id: "651f174d0425e8f76cec81ec",
                name: "2",
                summary: "2",
                bedrooms: "2",
                bathrooms: "2"
            },
            {
                _id: "651f1acf0425e8f76cec81ed",
                name: "The Three Little Pigs",
                summary: "This is actually three little huts.  One made of hay, one made of sticks, and one made of bricks.",
                bedrooms: "3",
                bathrooms: "1"
            },
            {
                _id: "651f1d170425e8f76cec81ee",
                name: "Hupty Dumpty",
                summary: "Just a wall",
                bedrooms: "0",
                bathrooms: "0"
            },
            {
                _id: "651f2610807b8113ae56fe6f",
                name: "search",
                summary: "api",
                bedrooms: "3",
                bathrooms: "12"
            },
            {
                _id: "651f262a807b8113ae56fe70",
                name: "3425",
                summary: "2345",
                bedrooms: "3",
                bathrooms: "3"
            },
            {
                _id: "651f2631807b8113ae56fe71",
                name: "ertgwert",
                summary: "erwtwert",
                bedrooms: "5",
                bathrooms: "6"
            },
            {
                _id: "651f2637807b8113ae56fe72",
                name: "456546",
                summary: "4654",
                bedrooms: "54",
                bathrooms: "4"
            },
            {
                _id: "651f2640807b8113ae56fe73",
                name: "asdfhsgh",
                summary: "sdfgsdfgsdfgsdfg",
                bedrooms: "444",
                bathrooms: "4"
            }
        ]
    
        // Create a mock client
        client = {
            db: jasmine.createSpy('db').and.returnValue({
                collection: jasmine.createSpy('collection').and.returnValue({
                    find: jasmine.createSpy('find').and.returnValue({
                        project: jasmine.createSpy('project').and.returnValue({
                            limit: jasmine.createSpy('limit').and.returnValue({
                                toArray: jasmine.createSpy('toArray').and.returnValue(
                                    Promise.resolve(jsonList)
                                )
                            }),
                        }),
                    }),
                }),
            }),
            connect: jasmine.createSpy('connect').and.returnValue(Promise.resolve()),
            close: jasmine.createSpy('close').and.returnValue(Promise.resolve()),
    
        };
        dbInterface = new DBInterface("test", client, "test", "test");
    });

    it("of ten", async () => {
        const checkItem = {
            _id: "6515af6e06454f70b41123f7",
            name: "apiedittest",
            summary: "A charming loft in the outskirts of Portland",
            bedrooms: "5",
            bathrooms: "1"
        };
        
        const result = await dbInterface.getListings(10);
        expect(result).not.toBeNull();
        expect(result.length).toBe(10);
        expect(result[0]._id).toBe(checkItem._id);
        expect(result[0].name).toBe(checkItem.name);
        expect(result[0].summary).toBe(checkItem.summary);
        expect(result[0].bedrooms).toBe(checkItem.bedrooms);
        expect(result[0].bathrooms).toBe(checkItem.bathrooms);
    });

});

describe("find a list of listings ", () => {
    let dbInterface;
    let client;
    
    const jsonList = {
        _id: "6515af6e06454f70b41123f7",
        name: "apiedittest",
        summary: "A charming loft in the outskirts of Portland",
        bedrooms: "5",
        bathrooms: "1"
    };

    function foundItem() {
    
        // Create a mock client
        client = {
            db: jasmine.createSpy('db').and.returnValue({
                collection: jasmine.createSpy('collection').and.returnValue({
                    findOne: jasmine.createSpy('findOne').and.returnValue(    
                        Promise.resolve(jsonList)
                    ),
                }),
            }),
            connect: jasmine.createSpy('connect').and.returnValue(Promise.resolve()),
            close: jasmine.createSpy('close').and.returnValue(Promise.resolve()),
    
        };

        dbInterface = new DBInterface("test", client, "test", "test");
    }

    function notFoundItem() {
    
        // Create a mock client
        client = {
            db: jasmine.createSpy('db').and.returnValue({
                collection: jasmine.createSpy('collection').and.returnValue({
                    findOne: jasmine.createSpy('findOne').and.returnValue(    
                        Promise.resolve(null)
                    ),
                }),
            }),
            connect: jasmine.createSpy('connect').and.returnValue(Promise.resolve()),
            close: jasmine.createSpy('close').and.returnValue(Promise.resolve()),
    
        };

        dbInterface = new DBInterface("test", client, "test", "test");
    }

    it("searches with ID", async () => {
        foundItem();

        const search = {"_id": "6515af6e06454f70b41123f7"};

        const result = await dbInterface.getListingByID(search);

        expect(result).not.toBeNull();
        expect(result._id).toBe(jsonList._id);
        expect(result.name).toBe(jsonList.name);
        expect(result.summary).toBe(jsonList.summary);
        expect(result.bedrooms).toBe(jsonList.bedrooms);
        expect(result.bathrooms).toBe(jsonList.bathrooms);
    });

    it("searches with non existing ID", async () => {
        notFoundItem()

        const search = {"_id": "6515af6e06454f70b41123f6"};

        const result = await dbInterface.getListingByID(search);

        expect(result).toBeNull();
    });

    it("searches with name", async () => {
        foundItem();

        const search = {"name": jsonList.name};

        const result = await dbInterface.getListingByID(search);

        expect(result).not.toBeNull();
        expect(result._id).toBe(jsonList._id);
        expect(result.name).toBe(jsonList.name);
        expect(result.summary).toBe(jsonList.summary);
        expect(result.bedrooms).toBe(jsonList.bedrooms);
        expect(result.bathrooms).toBe(jsonList.bathrooms);
    });

    it("searches with non existing Name", async () => {
        notFoundItem()

        const search = {"name": "bob"};

        const result = await dbInterface.getListingByID(search);

        expect(result).toBeNull();
    });
});

describe("Update Listing ", () => {
    let dbInterface;
    let client;
    
    function update(expectedCount) {
        returnthis = {
            acknowledged: true,
            modifiedCount: 1,
            upsertedId: null,
            upsertedCount: 0,
            matchedCount: expectedCount
        };     
        client = {
            db: jasmine.createSpy('db').and.returnValue({
                collection: jasmine.createSpy('collection').and.returnValue({
                    updateOne: jasmine.createSpy('updateOne').and.returnValue(    
                        Promise.resolve(returnthis)
                    ),
                }),
            }),
            connect: jasmine.createSpy('connect').and.returnValue(Promise.resolve()),
            close: jasmine.createSpy('close').and.returnValue(Promise.resolve()),
    
        };
        dbInterface = new DBInterface("test", client, "test", "test");
    };

    it("updates existing object", async () => {
        update(1);

        jsonList = {
            _id: "6515af6e06454f70b41123f7",
            name: "apiedittest",
            summary: "A charming loft in the outskirts of Portland",
            bedrooms: "5",
            bathrooms: "1"
        };

        const result = await dbInterface.updateListingByID("6515af6e06454f70b41123f7", jsonList);

        expect(result).toBe(true);
    });

    it("updates non-existing object", async () => {
        update(0);

        jsonList = {
            _id: "6515af6e06454f70b41123f7",
            name: "apiedittest",
            summary: "A charming loft in the outskirts of Portland",
            bedrooms: "5",
            bathrooms: "1"
        };

        const result = await dbInterface.updateListingByID("6515af6e06454f70b41123f6", jsonList);
        expect(result).toBe(false);
    });
});

describe("Remove Listing ", () => {
    let dbInterface;
    let client;

    function mockDelete(expectedCount) {
        returnthis = { acknowledged: true, deletedCount: expectedCount };     
        client = {
            db: jasmine.createSpy('db').and.returnValue({
                collection: jasmine.createSpy('collection').and.returnValue({
                    deleteOne: jasmine.createSpy('deleteOne').and.returnValue(    
                        Promise.resolve(returnthis)
                    ),
                }),
            }),
            connect: jasmine.createSpy('connect').and.returnValue(Promise.resolve()),
            close: jasmine.createSpy('close').and.returnValue(Promise.resolve()),
    
        };
        dbInterface = new DBInterface("test", client, "test", "test");
    };

    function mockManyDelete(expectedCount) {
        returnthis = { acknowledged: true, deletedCount: expectedCount };     
        client = {
            db: jasmine.createSpy('db').and.returnValue({
                collection: jasmine.createSpy('collection').and.returnValue({
                    deleteMany: jasmine.createSpy('deleteMany').and.returnValue(    
                        Promise.resolve(returnthis)
                    ),
                }),
            }),
            connect: jasmine.createSpy('connect').and.returnValue(Promise.resolve()),
            close: jasmine.createSpy('close').and.returnValue(Promise.resolve()),
    
        };
        dbInterface = new DBInterface("test", client, "test", "test");
    };


    it("removes one listing", async () => {
        mockDelete(1);

        const result = await dbInterface.deleteListingByID("6515af6e06454f70b41123f7");

        expect(result).toBe(true);
    });

    it("tries to remove one listing with invalid id", async () => {
        mockDelete(0);

        const result = await dbInterface.deleteListingByID("6515af6e06454f70b41123f7");

        expect(result).toBe(false);
    });

    it("removes mulitple listings", async () => {
        mockManyDelete(2);

        idToDelete =  ["651b15a8834dc25b25b2c1bd", "6519c4013ff0b9c450702785"];

        const result = await dbInterface.deleteListingsByID(idToDelete);

        expect(result).toBe(2);
    });

    it("Try to remove multiple none existing listings", async () => {
        mockManyDelete(0);

        idToDelete =  ["651b15a8834dc25b25b2c1bd", "6519c4013ff0b9c450702785"];

        const result = await dbInterface.deleteListingsByID(idToDelete);

        expect(result).toBe(0);
    });

    it("Try to remove multiple listings one exist and one doesn't", async () => {
        mockManyDelete(1);

        idToDelete =  ["651b15a8834dc25b25b2c1bd", "6519c4013ff0b9c450702785"];

        const result = await dbInterface.deleteListingsByID(idToDelete);

        expect(result).toBe(1);
    });
});