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

describe('Game', function() {

  it('launches and starts', function(done) {
    startGame()
      .then((payload) => done())
      .catch((e) => {
        console.log(e);
      });
  });

  it('validates player move', function(done) {
    startGame()
      .then((payload) => {
        const state = payload.sessionAttributes.game_state;

        // bad palyer 1 move
        test.alexa.spoken(`taxi to {${STARTING_POSITION_NEXT_MOVE[state.positions[1].toString()][1]}}`, function(error, payload) {
          expect(payload.response.outputSpeech.ssml)
            .to.contain("Player 1, you cannot move");

          done();
        });
      })
      .catch((e) => {
        console.log(e);
      });
  });

  it('continues to next turn', function(done) {
    startGame()
      .then((payload) => {
        return playerMoves(payload, 'taxi');
      })
      .then((payload) => {
          done();
      })
      .catch((e) => {
        console.log(e);
      });
  });

  it('resumes play', function(done) {
    startGame()
      .then((payload) => {
        const state = payload.sessionAttributes.game_state;

        return playerMove(1, 'taxi', state);
      })
      .then((payload) => {
        const state = payload.sessionAttributes.game_state;

        // stop session
        test.alexa.intended('AMAZON.StopIntent', {}, function(error, payload) {
          expect(payload.response.outputSpeech.ssml)
            .to.contain("OK, Goodbye!");

          // restart skill
          test.alexa.intended('PlayerMoveAny', { "position": STARTING_POSITION_NEXT_MOVE[state.positions[2].toString()][0] }, function(error, payload) {
            expect(payload.response.outputSpeech.ssml)
              .to.contain("Player 3, its your move");

            done();
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  });

  it('moves player by best transportation', function(done) {
    startGame()
      .then((payload) => {
        const state = payload.sessionAttributes.game_state;

        return playerMove(1, 'move', state);
      })
      .then((payload) => done())
      .catch((e) => {
        console.log(e);
      });
  });
});


//# region game helpers

function startGame() {
  return new Promise((resolve, reject) => {
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
            .to.not.be.undefined;
          expect(payload.sessionAttributes.game_state)
            .to.not.be.undefined;
          
          resolve(payload);
        });
      });
    });
  });
}
function playerMoves(payload, transportation) {
  const state = payload.sessionAttributes.game_state;

  return new Promise((resolve, reject) => {
    playerMoveRecursive(1, transportation, state, resolve, reject);
  });
}
function playerMoveRecursive(player, transportation, state, resolve, reject)
{
  playerMove(player, transportation, state)
    .then((payload) => {
      if (player < 4) {
        // next player
        playerMoveRecursive(player + 1, transportation, state, resolve, reject);
      }
      else {
        resolve();
      }
    })
    .catch((e) => {
      console.log(e);
      reject();
    });
}
function playerMove(player, transportation, state) {
  transportation = transportation || 'move';

  return new Promise((resolve, reject) => {
    // palyer move
    test.alexa.spoken(`${transportation} to {${STARTING_POSITION_NEXT_MOVE[state.positions[player].toString()][0]}}`, function(error, payload) {
      if (player < 4) {
        expect(payload.response.outputSpeech.ssml)
          .to.contain(`Player ${player + 1}, its your move`);
      }
      else {
        // another turn
        expect(payload.response.outputSpeech.ssml)
          .to.contain("Mister X took the");
      }

      // done
      resolve(payload);
    });
  });
}

//# endregion