const chai = require('chai');
const bst = require('bespoken-tools');
const test = require('./initTest.js');

const expect = chai.expect;

it('Launches and starts', function(done) {
  test.alexa.launched(function(error, payload) {
    expect(payload.response.outputSpeech.ssml)
      .to.contain('Welcome to Scottsdale Yard. Are you ready to catch some bad hombres?');

    // start game
    test.alexa.spoken('start', function(error, payload) {
      expect(payload.response.outputSpeech.ssml)
        .to.contain('OK, lets get started');
      
      // start turn 1
      test.alexa.spoken('yes', function(error, payload) {
        expect(payload.response.outputSpeech.ssml)
          .to.contain('Starting turn 1');
          expect(payload.response.outputSpeech.ssml)
            .to.contain("Player 1, its your move");

        // palyer 1 move
        test.alexa.spoken('taxi to {3}', function(error, payload) {
          expect(payload.response.outputSpeech.ssml)
            .to.contain("Player 2, its your move");

          done();
        });
      });
    });
  });
});

