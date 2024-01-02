const { removeByEmail } = require('../../../server/users/model/user.model');
const sinon = require('sinon');

describe('user.model', () => {
    let sandbox;

    beforeAll(() => {
      sandbox = sinon.createSandbox();
    });
  
    afterAll(() => {
      sandbox.restore();
    });

    fit('should remove user by email and return true', async () => {
        returnthis = { acknowledged: true, deletedCount: 1 };

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

        const result = await removeByEmail('user@example.com');
        expect(result).toBe(true);
    });
  
    it('should remove user by email and return true with sinon', async () => {
      // Mock the MongoDB client and collection methods
      const deleteOneStub = sandbox.stub().resolves({ deletedCount: 1 });
      const collectionStub = sandbox.stub().returns({ deleteOne: deleteOneStub });
      const dbStub = sandbox.stub().returns({ collection: collectionStub });
      const clientStub = { db: dbStub };
      sandbox.stub(require('mongodb'), 'MongoClient').returns(clientStub);
  
      // Mock the config module to return a dummy URI
      sandbox.stub(require('../../../env.config'), 'database').returns({
        host: 'dummyUri',
        database: 'dummyDb',
        admin: 'dummyCollection',
      });
  
      const result = await removeByEmail('user@example.com');
  
      expect(result).toBe(true);
      expect(deleteOneStub.calledOnce).toBe(true);
      expect(collectionStub.calledOnceWith('dummyCollection')).toBe(true);
      expect(dbStub.calledOnceWith('dummyDb')).toBe(true);
      expect(clientStub.db.calledOnceWith('dummyDb')).toBe(true);
    });

});