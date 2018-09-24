import SharedBox from '../src/sharedbox.js';
let expect = require('chai').expect;

export default describe('SharedBox', () => {
  let sharedBox = {};

  beforeEach(() => {
    sharedBox = new SharedBox.Helpers.Sharedbox({
      userEmail: 'email',
      subject: 'subject',
      message: 'this is a message',
      uploadUrl: 'wowUrl',
      notificationLanguage: 'Russian',
      expiration: '2018-02-04',
      userId: 1,
      status: 'in_progress',
      previewUrl: 'aaa.bbb',
      createdAt: '2018-02-03',
      updatedAt: '2018-02-04',
      closedAt:  '2018-02-04'
    });
  });

  describe('instantiation', () => {
    it('is properly intantiated', () => {
      expect(sharedBox.userEmail).to.equal('email');
      expect(sharedBox.subject).to.equal('subject');
      expect(sharedBox.message).to.equal('this is a message');
      expect(sharedBox.uploadUrl).to.equal('wowUrl');
      expect(sharedBox.notificationLanguage).to.equal('Russian');
      expect(sharedBox.expiration).to.equal('2018-02-04');
      expect(sharedBox.userId).to.equal(1);
      expect(sharedBox.status).to.equal('in_progress');
      expect(sharedBox.previewUrl).to.equal('aaa.bbb');
      expect(sharedBox.createdAt).to.equal('2018-02-03');
      expect(sharedBox.updatedAt).to.equal('2018-02-04');
      expect(sharedBox.closedAt).to.equal('2018-02-04');
    });
  });

  describe('toJson()', () => {
    it('returns the Json representing the Json', () => {
      expect(sharedBox.toJson()).to.equal('{"sharedbox":{"guid":null,"userEmail":"email","uploadUrl":"wowUrl","subject":"subject","message":"this is a message","recipients":[],"documentIds":[],"expirationValue":null,"expirationUnit":null,"retentionPeriodType":null,"retentionPeriodValue":null,"retentionPeriodUnit":null,"notificationLanguage":"Russian"}}');
    });
  });
});
