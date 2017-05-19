const chai = require('chai');
const bst = require('bespoken-tools');
const test = require('./initTest.js');

const expect = chai.expect;

// where to move to from starting position (by Bus)
// first value is valid, second is invalid
const STARTING_POSITION_NEXT_MOVE = {
  "13": [23, 14],
  "26": [15, 13],
  "29": [41, 55],
  "34": [22, 35],
  "50": [49, 67],
  "53": [69, 52],
  "91": [105, 89],
  "94": [93, 74],
  "103": [102, 104],
  "112": [111, 113],
  "117": [116, 118],
  "123": [124, 125],
  "138": [124, 139],
  "141": [133, 140],
  "155": [156, 153],
  "174": [161, 173]
};

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
        
        expect(payload.sessionAttributes)
          .to.not.be.null;
        expect(payload.sessionAttributes.positions)
          .to.not.be.null;

        const positions = payload.sessionAttributes.positions;

        // palyer 1 move
        test.alexa.spoken(`taxi to {${STARTING_POSITION_NEXT_MOVE[positions[1].toString()][0]}}`, function(error, payload) {
          expect(payload.response.outputSpeech.ssml)
            .to.contain("Player 2, its your move");

          done();
        });
      });
    });
  });
});

it('Validates player move', function(done) {
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
            .to.contain("Player 1, its your move");
        
        expect(payload.sessionAttributes)
          .to.not.be.null;
        expect(payload.sessionAttributes.positions)
          .to.not.be.null;

        const positions = payload.sessionAttributes.positions;

        // palyer 1 move
        test.alexa.spoken(`taxi to {${STARTING_POSITION_NEXT_MOVE[positions[1].toString()][1]}}`, function(error, payload) {
          expect(payload.response.outputSpeech.ssml)
            .to.contain("Player 1, you cannot move");

          done();
        });
      });
    });
  });
});

it('Moves player by best transportation', function(done) {
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
            .to.contain("Player 1, its your move");
        
        expect(payload.sessionAttributes)
          .to.not.be.null;
        expect(payload.sessionAttributes.positions)
          .to.not.be.null;

        const positions = payload.sessionAttributes.positions;

        // palyer 1 move
        test.alexa.spoken(`move to {${STARTING_POSITION_NEXT_MOVE[positions[1].toString()][0]}}`, function(error, payload) {
          expect(payload.response.outputSpeech.ssml)
            .to.contain("Player 2, its your move");

          done();
        });
      });
    });
  });
});
