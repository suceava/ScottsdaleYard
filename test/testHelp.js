const chai = require('chai');
const bst = require('bespoken-tools');
const test = require('./initTest.js');

const expect = chai.expect;


describe('Help', function() {

  it('after launch', function(done) {
    test.alexa.launched(function(error, payload) {
      test.alexa.intended('AMAZON.HelpIntent', {}, function(error, payload) {
        expect(payload.response.outputSpeech.ssml)
          .to.contain('help me help you');

        done();
      });
    });
  });

  it('after game start', function(done) {
    test.alexa.launched(function(error, payload) {
      expect(payload.response.outputSpeech.ssml)
        .to.contain('Welcome to Scottsdale Yard');

      // start game
      test.alexa.spoken('start', function(error, payload) {
        test.alexa.intended('AMAZON.HelpIntent', {}, function(error, payload) {
          expect(payload.response.outputSpeech.ssml)
            .to.contain('help me help you');

          done();
        });
      });
    });
  });

  it('after game turn', function(done) {
    test.alexa.launched(function(error, payload) {
      expect(payload.response.outputSpeech.ssml)
        .to.contain('Welcome to Scottsdale Yard');

      // start game
      test.alexa.spoken('start', function(error, payload) {
        expect(payload.response.outputSpeech.ssml)
          .to.contain('OK, lets get started');
        
        // start turn 1
        test.alexa.spoken('yes', function(error, payload) {
          test.alexa.intended('AMAZON.HelpIntent', {}, function(error, payload) {
            expect(payload.response.outputSpeech.ssml)
              .to.contain('help me help you');

            done();
          });
        });
      });
    });
  });

});
