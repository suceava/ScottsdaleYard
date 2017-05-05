const chai = require('chai');
const bst = require('bespoken-tools');

const assert = chai.assert;

let server = null;
let alexa = null;

beforeEach(function(done) {
  server = new bst.LambdaServer('../src/index.js', 10000, true);
  alexa = new bst.BSTAlexa('http://localhost:10000',
                            '../alexa/intent_schema.json',
                            '../alexa/utterances.txt');

  server.start(function() {
    alexa.start(function(error) {
      if (error !== undefined) {
        console.error('Error: ' + error);
      }
      else {
        done();
      }
    });
  });
});

afterEach(function(done) {
  alexa.stop(function() {
    server.stop(function() {
      done();
    });
  });
});


it('Launches and starts', function(done) {
  alexa.launched(function(error, payload) {
    assert.equal(payload.response.outputSpeech.ssml, '<speak> Welcome to Scottsdale Yard. Are you ready to catch some bad hombres?  </speak>');

    alexa.spoken('Yes', function(error, payload) {
      assert.equal(payload.response.outputSpeech.ssml, '<speak></speak>');

      done();
    });
  });
});