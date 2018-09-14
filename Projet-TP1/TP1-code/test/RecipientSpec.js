import SharedBox from '../src/sharedbox.js';
let expect = require('chai').expect;

export default describe('Recipient', () => {
  let recipient;

  beforeEach(() => {
    recipient = new SharedBox.Helpers.Recipient({email: 'foo@bar.baz', firstName: 'foo', lastName: 'bar'});
  });

  describe('instantiation', () => {
    it('is properly intantiated', () => {
      expect(recipient.email).to.equal('foo@bar.baz');
      expect(recipient.firstName).to.equal('foo');
      expect(recipient.lastName).to.equal('bar');
      expect(recipient.id).to.be.null;
      expect(recipient.options).to.not.be.null;
    });
  });

  describe('toJson()', () => {
    it('returns the json as a string', () => {
      expect(recipient.toJson()).to.equal('{"recipient":{"email":"foo@bar.baz","firstName":"foo","lastName":"bar","contactMethods":[]}}');
    });
  });

  describe('toObject()', () => {
    it('works as expected', () => {
      let object = recipient.toObject();
      expect(object.email).to.equal('foo@bar.baz');
      expect(object.firstName).to.equal('foo');
      expect(object.lastName).to.equal('bar');
      expect(object.id).to.be.null;
      expect(object.options).to.not.be.null;
    });
  });
});
