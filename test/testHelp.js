const chai = require('chai');
const bst = require('bespoken-tools');
const test = require('./initTest.js');

const expect = chai.expect;


it('Gets help on launch', function(done) {
  test.alexa.launched(function(error, payload) {
    test.alexa.intended('AMAZON.HelpIntent', {}, function(error, payload) {
      expect(payload.response.outputSpeech.ssml)
        .to.contain('help me help you');

      done();
    });
  });
});