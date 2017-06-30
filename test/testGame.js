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
  "174": [161, 173],

  // move back to original position
  "15": [26],
  "22": [34],
  "23": [13],
  "41": [29],
  "49": [50],
  "69": [53],
  "93": [94],
  "102": [103],
  "105": [91],
  "111": [112],
  "116": [117],
  "124": [123],
  "133": [141],
  "156": [155],
  "161": [174]
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

  it('continues to next turn with generic move', function(done) {
    startGame()
      .then((payload) => {
        return playerMoves(payload, 'move');
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
          test.alexa.launched(function(error, payload) {
            expect(payload.response.outputSpeech.ssml)
              .to.contain("Welcome back to Scottsdale Yard");
            expect(payload.response.outputSpeech.ssml)
              .to.contain("would you like to continue");

            // continue saved game
            test.alexa.intended('AMAZON.YesIntent', {}, function(error, payload) {
              expect(payload.response.outputSpeech.ssml)
                .to.contain('It is turn 1');

              done();
            });
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  });

  it('resumes play with move', function(done) {
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

describe('Full game', function() {
  it('finishes a game', function(done) {
    this.timeout(10000)
    startGame()
      .then((payload) => {
        return playTurns(payload, 'move');
      })
      .then((payload) => {
          done();
      })
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
function playTurns(payload, transportation) {
  const state = payload.sessionAttributes.game_state;

  return new Promise((resolve, reject) => {
    playTurnRecursive(payload, 1, transportation, state, resolve, reject);
  });
}
function playTurnRecursive(payload, turn, transportation, state, resolve, reject) {
  playerMoves(payload, transportation)
    .then((payload) => {
      if (turn < 22) {
        // next turn
        playTurnRecursive(payload, turn + 1, transportation, state, resolve, reject);
      }
      else {
        resolve(payload);
      }
    })
    .catch((e) => {
      console.log(e);
      reject();
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
        resolve(payload);
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
      if (payload.response.shouldEndSession && state.turn < 22) {
        // game finished before all turns => we caught Mr. X ??
        expect(payload.response.outputSpeech.ssml)
          .to.contain("Congratulations! You caught Mr. X");
      }
      else if (player < 4) {
        expect(payload.response.outputSpeech.ssml)
          .to.contain(`Player ${player + 1}, its your move`);
      }
      else if (state.turn < 22) {
        // another turn
        expect(payload.response.outputSpeech.ssml)
          .to.contain("Mister X took the");
      }
      else {
        // game finished
        expect(payload.response.outputSpeech.ssml)
          .to.contain("Sorry, you failed to catch");
      }

      // done
      resolve(payload);
    });
  });
}

//# endregion