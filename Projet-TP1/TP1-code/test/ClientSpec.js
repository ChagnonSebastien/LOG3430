import SharedBox from '../src/sharedbox.js';
import * as Utils from '../src/Utils/platform.js';
var sinon = require('sinon');
let expect = require('chai').expect;


export default describe('Client', () => {
  let client = {};
  const token = 'token';
  const userId = 1;
  const endpoint = 'http://sharedbox.polymtl.ca';



  describe('instantiation', () => {

    it('is properly intantiated without caching', () => {
      client = new SharedBox.Client(token, userId, endpoint);
      expect(client.apiToken).to.equal(token);
      expect(client.userId).to.equal(userId);
      expect(client.endpoint).to.equal(endpoint);
      expect(client.jsonClient).to.deep.equal(new SharedBox.JsonClient(token, userId, endpoint));
    });

    it('is properly intantiated with caching', () => {
      client = new SharedBox.Client(token, userId, endpoint, true);
      expect(client.apiToken).to.equal(token);
      expect(client.userId).to.equal(userId);
      expect(client.endpoint).to.equal(endpoint);
      expect(client.jsonClient).to.deep.equal(new SharedBox.JsonClient(token, userId, endpoint, true));
    });
  });

  describe('initializeSharedBox()', () => {
    
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

    const expectedNewSharedBox = {
      userEmail: 'user@acme.com',
      guid: '1c820789a50747df8746aa5d71922a3g',
      uploadUrl: 'new_upload_url',
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
      guid: '1c820789a50747df8746aa5d71922a3g',
      uploadUrl: 'new_upload_url'
    };
    
    var stub;
    
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
          client = new SharedBox.Client(token, userId, endpoint, true);
          clock = sinon.useFakeTimers(1010);
        });

        after(() => {
          clock.restore();
        });
    
        it('must return the correct response', async () => {
    
          // On appelle la méthde a tester.
          var promise = await client.initializeSharedBox(sharedBox);
          expect(promise).to.deep.equal(expectedNewSharedBox);
        });

        it('must call the right URL to get the SharedBox Endpoint', async () => {
    
          // On appelle la méthde a tester.
          await client.initializeSharedBox(sharedBox);
          expect(stub.getCall(0).args[0]).to.equal(`${endpoint}/services/sharedbox/server/url`);
        });
    
        it('must call the right URL to make the request', async () => {
    
          // On appelle la méthde a tester.
          await client.initializeSharedBox(sharedBox);
          expect(stub.getCall(1).args[0]).to.equal(`${text}api/sharedboxes/new?email=${sharedBox.userEmail}&rand=1010`);
        });

      });
      
      describe('if caching is set to false', () => {

        before(() => {
          client = new SharedBox.Client(token, userId, endpoint, false);
        });
    
        it('must return the correct response', async () => {
    
          // On appelle la méthde a tester.
          var promise = await client.initializeSharedBox(sharedBox);
          expect(promise).to.deep.equal(expectedNewSharedBox);
        });

        it('must call the right URL to get the SharedBox Endpoint', async () => {
    
          // On appelle la méthde a tester.
          await client.initializeSharedBox(sharedBox);
          expect(stub.getCall(0).args[0]).to.equal(`${endpoint}/services/sharedbox/server/url`);
        });
    
        it('must call the right URL to make the request', async () => {
    
          // On appelle la méthde a tester.
          await client.initializeSharedBox(sharedBox);
          expect(stub.getCall(1).args[0]).to.equal(`${text}api/sharedboxes/new?email=${sharedBox.userEmail}`);
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
        client = new SharedBox.Client(token, userId, endpoint);
      });
    
      it('must throw error', async () => {
  
        await client.initializeSharedBox(sharedBox).then(result => {
          expect(result).to.deep.equal(expectedNewSharedBox);
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
        client = new SharedBox.Client(token, userId, endpoint);
      });
    
      it('must throw error', async () => {
  
        await client.initializeSharedBox(sharedBox).then(result => {
          expect(result).to.equal(expectedNewSharedBox);
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
        client = new SharedBox.Client(token, userId, endpoint, false);
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
        var promise = await client.initializeSharedBox(sharedBox);
        expectedNewSharedBox.guid = undefined;
        expectedNewSharedBox.uploadUrl = undefined;
        expect(promise).to.deep.equal(expectedNewSharedBox);
      });

    });

  });

  describe('submitSharedBox()', () => {

    it('must throw an error if guid is not specified', async () => {
      try {
        client.submitSharedBox({});
      } catch (err) {
        expect(err.message).to.equal('SharedBox GUID cannot be null or undefined');
      }
    });

    let stub;

    let sharedBox = {
      userEmail: 'user@acme.com',
      guid: '1c820789a50747df8746aa5d71922a3f',
      uploadUrl: 'upload_url',
      recipients: [/* list of Recipient objects*/],
      attachments: [/*list of Attachment objects*/],
      message: 'lorem ipsum...',
      subject: 'Donec rutrum congue leo eget malesuada.',
      toObject: function(){
        return this;
      },
      toJson: function() {
        return JSON.stringify(this);
      },
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
    
    const expectedNewSharedBox = {
      guid:'1c820789a50747df8746aa5d71922a3f',
      'userEmail':'user@acme.com',
      'subject':'Donec rutrum congue leo eget malesuada.',
      'message':'lorem ipsum...',
      'uploadUrl':'upload_url',
      'notificationLanguage':'en',
      'expiration':'2018-05-31T14:45:35.038Z',
      'securityOptions':{
        'retentionPeriodType':null,
        'retentionPeriodValue':null,
        'retentionPeriodUnit':null,
        'expirationValue':null,
        'expirationUnit':null
      }
    };
    
    const response = {
      ok: true,
      status: 200,
      statusText: 'OK',
      text: function(){
        return 'NOT_NULL';
      },
      json: function() {
        return sharedBox;
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
      client = new SharedBox.Client(token, userId, endpoint);
    });

    it('must return the modified sharedbox', async () => {
      const response = await client.submitSharedBox(sharedBox);
      console.log(JSON.stringify(response));
      expect(response.securityOptions).to.deep.equal(expectedNewSharedBox.securityOptions);
    });

  });
});
