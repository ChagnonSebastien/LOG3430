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
    it('must call the right URL', () => {
      var mock = sinon.mock(Utils);
      mock.expects('fetch').returns(200);
      jsonClient.initializeSharedBox("email@allo");
      mock.verify();
    });
  });
});
