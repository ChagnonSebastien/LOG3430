import SharedBox from '../src/sharedbox.js';
import * as Utils from '../src/Utils/platform.js';
var sinon = require('sinon');
let expect = require('chai').expect;


export default describe('JsonClient', () => {
  let jsonClient = {};
  const token = 'token';
  const userId = 1;
  const endpoint = 'http://sharedbox.polymtl.ca';
  const email = 'email@email.com';


  describe('instantiation', () => {

    it('is properly intantiated without caching', () => {
      jsonClient = new SharedBox.JsonClient(token, userId, endpoint);
      expect(jsonClient.apiToken).to.equal(token);
      expect(jsonClient.userId).to.equal(userId);
      expect(jsonClient.endpoint).to.equal(endpoint);
      expect(jsonClient.noCaching).to.equal(false);
    });

    it('is properly intantiated with caching', () => {
      jsonClient = new SharedBox.JsonClient(token, userId, endpoint, true);
      expect(jsonClient.apiToken).to.equal(token);
      expect(jsonClient.userId).to.equal(userId);
      expect(jsonClient.endpoint).to.equal(endpoint);
      expect(jsonClient.noCaching).to.equal(true);
    });
  });

  describe('initializeSharedBox()', () => {
    
    var stub;

    const jsonResponse = {
      'guid': 'dc6f21e0f02c41123b795e4',
      'uploadUrl': 'upload_url'
    };
    
    describe('if request is \'ok\'', () => {
      const text = 'NOT_NULL';
      const response = {
        ok: true,
        text: function(){
          return text;
        },
        json: function(){
          return jsonResponse;
        }
      };
    
      beforeEach(() => {
        stub = sinon.stub(Utils,'fetch');
        stub.resolves(response);
  
      });
      
      afterEach(() => {
        stub.restore();
      });

      describe('if caching is set to true', () => {

        let clock;

        before(() => {
          jsonClient = new SharedBox.JsonClient(token, userId, endpoint, true);
          clock = sinon.useFakeTimers(1010);
        });

        after(() => {
          clock.restore();
        });
    
        it('must return the correct response', async () => {
    
          // On appelle la méthde a tester.
          var promise = await jsonClient.initializeSharedBox(email);
          expect(promise).to.equal(jsonResponse);
        });

        it('must call the right URL to get the SharedBox Endpoint', async () => {
    
          // On appelle la méthde a tester.
          await jsonClient.initializeSharedBox(email);
          expect(stub.getCall(0).args[0]).to.equal(`${endpoint}/services/sharedbox/server/url`);
        });
    
        it('must call the right URL to make the request', async () => {
    
          // On appelle la méthde a tester.
          await jsonClient.initializeSharedBox(email);
          expect(stub.getCall(1).args[0]).to.equal(`${text}api/sharedboxes/new?email=${email}&rand=1010`);
        });

      });
      
      describe('if caching is set to false', () => {

        before(() => {
          jsonClient = new SharedBox.JsonClient(token, userId, endpoint, false);
        });
    
        it('must return the correct response', async () => {
    
          // On appelle la méthde a tester.
          var promise = await jsonClient.initializeSharedBox(email);
          expect(promise).to.equal(jsonResponse);
        });

        it('must call the right URL to get the SharedBox Endpoint', async () => {
    
          // On appelle la méthde a tester.
          var promise = await jsonClient.initializeSharedBox(email);
          expect(promise).to.equal(jsonResponse);
          expect(stub.getCall(0).args[0]).to.equal(`${endpoint}/services/sharedbox/server/url`);
        });
    
        it('must call the right URL to make the request', async () => {
    
          // On appelle la méthde a tester.
          var promise = await jsonClient.initializeSharedBox(email);
          expect(promise).to.equal(jsonResponse);
          expect(stub.getCall(1).args[0]).to.equal(`${text}api/sharedboxes/new?email=${email}`);
        });

      });
      
    });
    
    describe('if request is not \'ok\'', () => {
      const text = 'NOT_NULL';
      const status = 200;
      const statusText = 'statusText';
      const response = {
        ok: false,
        status: status,
        statusText: statusText,
        text: function(){
          return text;
        },
        json: function(){
          return jsonResponse;
        }
      };
    
      beforeEach(() => {
        stub = sinon.stub(Utils,'fetch');
        stub.resolves(response);
  
      });
      
      afterEach(() => {
        stub.restore();
      });

      before(() => {
        jsonClient = new SharedBox.JsonClient(token, userId, endpoint);
      });
    
      it('must throw error', async () => {
  
        await jsonClient.initializeSharedBox(email).then(result => {
          expect(result).to.equal(jsonResponse);
        }).catch(err => {
          expect(err.code).to.equal(status);
          expect(err.message).to.equal(statusText);
        });
      });

    });
      
    describe('if response text is \'\'', () => {
      const text = '';
      const response = {
        ok: true,
        text: function(){
          return text;
        },
        json: function(){
          return jsonResponse;
        }
      };
    
      beforeEach(() => {
        stub = sinon.stub(Utils,'fetch');
        stub.resolves(response);
  
      });
      
      afterEach(() => {
        stub.restore();
      });

      before(() => {
        jsonClient = new SharedBox.JsonClient(token, userId, endpoint);
      });
    
      it('must throw error', async () => {
  
        await jsonClient.initializeSharedBox(email).then(result => {
          expect(result).to.equal(jsonResponse);
        }).catch(err => {
          expect(err).to.equal('Unexpected server response format');
        });
      });

    });
      
    describe('if response status is 204', () => {
      const response = {
        ok: true,
        status: 204,
        text: function(){
          return 'NOT_NULL';
        },
        json: function(){
          return jsonResponse;
        }
      };

      before(() => {
        jsonClient = new SharedBox.JsonClient(token, userId, endpoint, false);
      });
    
      beforeEach(() => {
        stub = sinon.stub(Utils,'fetch');
        stub.resolves(response);
  
      });
      
      afterEach(() => {
        stub.restore();
      });
  
      it('must return an empty object', async () => {
        
        // On appelle la méthde a tester.
        var promise = await jsonClient.initializeSharedBox(email);
        expect(promise).to.deep.equal({});
      });

    });

  });

  /*describe('submitSharedBox()', () => {
    it('must call the right URL', async () => {

      var stub = sinon.stub(Utils,'fetch');

      // On crée l'objet bidon constituant le retour du stub
      var jsonResponse = {
        'guid': 'dc6f21e0f02c41123b795e4',
        'uploadUrl': 'upload_url'
      };

      var response = {
        ok: true,
        text: function(){
          return 'NOT NULL';
        },
        json: function(){
          return jsonResponse;
        }
      };

      // Dit a sinon de renvoyer un Promise contenant comme valeur de retour
      // le contenu de l'objet response.
      stub.resolves(response);

      // On appelle la méthde a tester.
      var promise = await jsonClient.initializeSharedBox('email@email.com');
      expect(promise).to.equal(jsonResponse);
    });
  }); */
});
