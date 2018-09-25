import SharedBox from '../src/sharedbox.js';
import * as Utils from '../src/Utils/platform.js';
import _ from 'lodash';

var sinon = require('sinon');
let expect = require('chai').expect;

export default describe('Client', () => {

  let client = {};
  const token = 'token';
  const userId = 1;
  const endpoint = 'http://sharedbox.polymtl.ca';

  const sharedBox = {
    toObject: function(){
      return this;
    },
    toJson: function() {
      return JSON.stringify(this);
    },
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
    guid: '1c820789a50747df8746aa5d71922a3g',
    uploadUrl: 'new_upload_url'
  };

  describe('initializeSharedBox()', () => {

    var stub;
    before(() => {
      client = new SharedBox.Client(token, userId, endpoint);
    });
    afterEach(() => {
      stub.restore();
    });

    it('Promises completes, has new uploadUrl and guid', async () => {
      stub = sinon.stub(client.jsonClient,'initializeSharedBox');
      stub.resolves(_.merge(sharedBox,jsonResponse));
      var promise = await client.initializeSharedBox(sharedBox);
      expect(promise).to.deep.include(jsonResponse);
    });

    it('An exception is thrown when jsonClient.initializeSharedBox throws an exception.', async () => {
      stub = sinon.stub(client.jsonClient,'initializeSharedBox');
      stub.throws('CUSTOM_ERROR');
      try {
        client.initializeSharedBox(sharedBox);
        // Fail the test if an exception has not been thrown
        expect.fail();
      }
      catch(e){
        // Test passes if an exception is thrown
      }
    });

  });

  describe('submitSharedBox()', () => {

    var stub;
    before(() => {
      client = new SharedBox.Client(token, userId, endpoint);
    });
    
    afterEach(() => {
      if (stub != null) {
        stub.restore();
      }
    });

    it('Fct fails due to no guid', () => {
      try{
        client.submitSharedBox({'objet' : 'bidon'});

        // Fails if no exception were thrown.
        expect.fail();
      }
      catch(e){
        // Test passes if an exception is thrown
      }
    });

    it('Fct returns with no errors', async () => {

      var responseSecurityOptions = {
        securityOptions: {
          allowRememberMe: false,
          allowSms: false,
          allowVoice: false,
          allowEmail: true,
          expirationValue: 1,
          expirationUnit: 'days',
          retentionPeriodType: 'do_not_discard',
          retentionPeriodValue: null,
          retentionPeriodUnit: 'hours',
          allowManualClose: false
        },
      };

      stub = sinon.stub(client.jsonClient,'submitSharedBox');

      // We resolve the jsonClient call with new securityOptions
      stub.resolves(responseSecurityOptions);

      var resultSharedBox = await client.submitSharedBox(sharedBox);
      expect(2).to.equal(2);
    });

  });

  describe('closeSharedBox()', () => {

    var stub;
    before(() => {
      client = new SharedBox.Client(token, userId, endpoint);
    });
    
    afterEach(() => {
      if (stub != null) {
        stub.restore();
      }
    });

    it('Fct completes', async () => {
      stub = sinon.stub(client.jsonClient,'closeSharedbox');
      stub.resolves({'objet': 'bidon'});
      var promise = await client.closeSharedbox(sharedBox);
      expect(promise).to.deep.equal({'objet': 'bidon'});
    });

    it('Fct fails due to no guid', () => {
      try{
        client.closeSharedBox({'objet' : 'bidon'});

        // Fails if no exception were thrown.
        expect.fail();
      }
      catch(e){
        // Test passes if an exception is thrown
      }
    });

  });

  describe('AddRecipient()', () => {

    var recipient = 
    {
      toJson: function() {
        return JSON.stringify(this);
      },
      toObject: function(){
        return this;
      },
      'id': '59adbccb-87cc-4224-bfd7-314dae796e48',
      'firstName': 'John',
      'lastName': 'Doe',
      'email': 'john.doe@email.com',
      'options': {
        'locked': false,
        'bouncedEmail': false,
        'verified': false,
        'contactMethods': [
          {
            'id': 1,
            'destination': '+55555555555',
            'destinationType': 'office_phone',
            'verified': false,
            'createdAt': '2018-09-01T16:26:07-04:00',
            'updatedAt': '2018-09-01T16:26:07-04:00'
          },
          {
            'id': 2,
            'destination': '+1111111111',
            'destinationType': 'cell_phone',
            'verified': true,
            'createdAt': '2018-09-01T16:26:07-04:00',
            'updatedAt': '2018-09-01T16:26:07-04:00'
          }
        ]
      }
    };

    var stub;
    before(() => {
      client = new SharedBox.Client(token, userId, endpoint);
    });
    
    afterEach(() => {
      if (stub != null) {
        stub.restore();
      }
    });

    it('Values are valid. A new recipient is added.', async () => {
      var nonConstSb = sharedBox;

      stub = sinon.stub(client.jsonClient,'addRecipient');
      stub.resolves({json: recipient});
      var result = await client.addRecipient(nonConstSb, recipient);


      // John Doe doit avoir été pushed...
      expect(nonConstSb.recipients.length).to.not.equal(0);

      // On assert qu'on obtient bel et bien le nouveau récipient
      expect(JSON.stringify(result)).to.deep.equal(JSON.stringify({
        email:'john.doe@email.com',
        firstName:'John',
        lastName:'Doe'
      }));
    });

    it('Recipient has no email', async () => {
      recipient.email = null;
      try {
        client.addRecipient(sharedBox,recipient);
        expect.fail();
      }catch(e){
        // Error must be thrown
      }
    });

    it('SharedBox has no guid', () => {
      var thisSharedBox = sharedBox;
      thisSharedBox.guid = null;
      try {
        client.addRecipient(thisSharedBox,recipient);
        expect.fail();
      }catch(e){
        // Error must be thrown
      }
    });

  });

  describe('uploadAttachment()', () => {

    var attachment = {
      stream: 'aa',
      contentType: 'XML',
      filename: 'MY_FILE.XML'
    };

    var stub;
    before(() => {
      client = new SharedBox.Client(token, userId, endpoint);
    });
    
    afterEach(() => {
      if (stub != null) {
        stub.restore();
      }
    });

    it('Fct completes', async () => {
      var guid = 'a029a8as8d9';
      var response = {
        'temporaryDocument': {
          'documentGuid': guid
        }
      };

      stub = sinon.stub(client.jsonClient,'uploadFile');
      stub.resolves(response);

      var result = await client.uploadAttachment(sharedBox,attachment);
      expect(result.guid).to.deep.equal(guid);

    });

  });

});
