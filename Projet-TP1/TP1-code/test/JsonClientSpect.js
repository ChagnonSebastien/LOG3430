import SharedBox from '../src/sharedbox.js';
import * as Utils from '../src/Utils/platform.js';
var sinon = require('sinon');
let expect = require('chai').expect;



export default describe('JsonClient', () => {
  let jsonClient = {};

  beforeEach(() => {
    jsonClient = new SharedBox.JsonClient('token', 1, 'http://sharedbox.polymtl.ca');
  });

  describe('instantiation', () => {
    it('is properly intantiated', () => {
      expect(jsonClient.apiToken).to.equal('token');
      expect(jsonClient.userId).to.equal(1);
      expect(jsonClient.endpoint).to.equal('http://sharedbox.polymtl.ca');
      expect(jsonClient.noCaching).to.equal(false);
    });
  });

  describe('initializeSharedBox()', () => {
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
