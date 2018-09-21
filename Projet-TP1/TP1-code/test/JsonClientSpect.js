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

  describe('submitSharedBox()', () => {
    
    var stub;

    const sharedBox = {
      userEmail: 'user@acme.com',
      guid: '1c820789a50747df8746aa5d71922a3f',
      uploadUrl: 'upload_url',
      recipients: [/* list of Recipient objects*/],
      attachments: [/*list of Attachment objects*/],
      message: 'lorem ipsum...',
      subject: 'Donec rutrum congue leo eget malesuada.',
      notificationLanguage: 'en',
      securityOptions: {
        allowRememberMe: true,
        allowSms: true,
        allowVoice: true,
        allowEmail: true,
        expirationValue: 5,
        expirationUnit: 'days',
        retentionPeriodType: 'do_not_discard',
        retentionPeriodValue: null,
        retentionPeriodUnit: 'hours',
        allowManualClose: true
      },
      userId: 1,
      status: 'in_progress',
      previewUrl: 'http://sharedbox.com/sharedboxes/dhjewg67ewtfg476/preview',
      createdAt: '2018-05-24T14:45:35.062Z',
      updatedAt: '2018-05-24T14:45:35.589Z',
      expiration: '2018-05-31T14:45:35.038Z',
      closedAt: null
    };

    const jsonResponse = {
      guid: '1c820789a50747df8746aa5d71922a3f',
      userId: 3,
      subject: 'Donec rutrum congue leo eget malesuada.',
      expiration: '2018-12-06T05:38:09.951Z',
      notificationLanguage: 'en',
      status:'in_progress',
      allowRememberMe: false,
      allowSms: false,
      allowVoice: false,
      allowEmail: true,
      retentionPeriodType: 'discard_at_expiration',
      retentionPeriodValue: null,
      retentionPeriodUnit: null,
      previewUrl: 'http://sharedbox.com/sharedboxes/dhjewg67ewtfg476/preview',
      createdAt: '2018-12-05T22:38:09.965Z',
      updatedAt: '2018-12-05T22:38:09.965Z'
    };

    const text = 'NOT_NULL';

    const response = {
      ok: true,
      status: 200,
      statusText: 'statusText',
      text: function(){
        return text;
      },
      json: function() {
        return jsonResponse;
      }
    };
  
    before(() => {
      jsonClient = new SharedBox.JsonClient(token, userId, endpoint);
      stub = sinon.stub(Utils,'fetch');
      stub.resolves(response);
    });
    
    after(() => {
      stub.restore();
    });

    it('must return the correct response', async () => {

      // On appelle la méthde a tester.
      var promise = await jsonClient.submitSharedBox(sharedBox);
      expect(promise).to.equal(jsonResponse);
    });

    it('must make the Ajax request to the right URL', async () => {
      expect(stub.getCall(1).args[0]).to.equal(`${text}api/sharedboxes`);
    });

    it('must make the Ajax request with the right parameters', async () => {
      expect(stub.getCall(1).args[1]).to.deep.equal({
        headers: {
          'Authorization-Token': token,
          'Content-Type': 'application/json'
        },
        method: 'post',
        body: sharedBox
      });
    });
  });

  describe('addRecipient()', () => {
    
    var stub;

    const recipient = {
      id: '59adbccb-87cc-4224-bfd7-314dae796e48',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      options: {
        locked: false,
        bouncedEmail: false,
        verified: false,
        contactMethods: [
          {
            id: 1,
            destination: '+55555555555',
            destinationType: 'office_phone',
            verified: false,
            createdAt: '2018-09-01T16:26:07-04:00',
            updatedAt: '2018-09-01T16:26:07-04:00'
          },
          {
            id: 2,
            destination: '+1111111111',
            destinationType: 'cell_phone',
            verified: true,
            createdAt: '2018-09-01T16:26:07-04:00',
            updatedAt: '2018-09-01T16:26:07-04:00'
          }
        ]
      }
    };

    const text = 'NOT_NULL';

    const response = {
      ok: true,
      status: 200,
      statusText: 'statusText',
      text: function(){
        return text;
      },
      json: function() {
        return recipient;
      }
    };
  
    before(() => {
      jsonClient = new SharedBox.JsonClient(token, userId, endpoint);
      stub = sinon.stub(Utils,'fetch');
      stub.resolves(response);
    });
    
    after(() => {
      stub.restore();
    });

    it('must return the correct response', async () => {

      // On appelle la méthde a tester.
      var promise = await jsonClient.addRecipient(recipient.guid, recipient);
      expect(promise).to.equal(recipient);
    });

    it('must make the Ajax request to the right URL', async () => {
      expect(stub.getCall(1).args[0]).to.equal(`${text}api/sharedboxes/${recipient.guid}/recipients`);
    });

    it('must make the Ajax request with the right parameters', async () => {
      expect(stub.getCall(1).args[1]).to.deep.equal({
        headers: {
          'Authorization-Token': token,
          'Content-Type': 'application/json'
        },
        method: 'post',
        body: recipient
      });
    });
  });

  describe('closeSharedbox()', () => {
    
    var stub;

    const guid = '59adbccb-87cc-4224-bfd7-314dae796e48';

    const jsonResponse = {
      result: true,
      message: 'Sharedbox successfully closed.' 
    };

    const text = 'NOT_NULL';

    const response = {
      ok: true,
      status: 200,
      statusText: 'statusText',
      text: function(){
        return text;
      },
      json: function() {
        return jsonResponse;
      }
    };
  
    before(() => {
      jsonClient = new SharedBox.JsonClient(token, userId, endpoint);
      stub = sinon.stub(Utils,'fetch');
      stub.resolves(response);
    });
    
    after(() => {
      stub.restore();
    });

    it('must return the correct response', async () => {

      // On appelle la méthde a tester.
      var promise = await jsonClient.closeSharedbox(guid);
      expect(promise).to.equal(jsonResponse);
    });

    it('must make the Ajax request to the right URL', async () => {
      expect(stub.getCall(1).args[0]).to.equal(`${text}api/sharedboxes/${guid}/close`);
    });

    it('must make the Ajax request with the right parameters', async () => {
      expect(stub.getCall(1).args[1]).to.deep.equal({
        headers: {
          'Authorization-Token': token,
          'Content-Type': 'application/json'
        },
        method: 'patch'
      });
    });
  });
});
