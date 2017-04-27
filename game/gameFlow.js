const Alexa = require('alexa-sdk');
const Speech = require('ssml-builder');
const Consts = require('../consts.js');

module.exports = {
  start: function(handler) {
    // set game mode.
    handler.handler.state = Consts.GAME_STATES.GAME;

    const speech = new Speech();
    speech.say('OK, lets get started');
    speech.pause('1s');
    speech.say('Mister X is currently invisible');
    speech.pause('1s');
    speech.say('Player 1 starts at 1');
    speech.pause('1s');
    speech.say('Player 2 starts at 13');
    speech.pause('1s');
    speech.say('Player 3 starts at 138');
    speech.pause('1s');
    speech.say('Player 4 starts at 193');
    speech.pause('1s');
    speech.say('Ready for turn 1?');    

    const speechOutput = speech.ssml(true);

    handler.attributes["turn"] = 1;
    handler.emit(':askWithCard', speechOutput, speechOutput, Consts.GAME_NAME, speechOutput);
  },

  startTurn: function(handler) {
    const turn = handler.attributes["turn"];
    handler.attributes["player"] = 1;

    const speech = new Speech();
    speech.say('Starting turn ' + turn);
    speech.pause('1s');
    
    this.doMisterXMove(handler, speech);
  },

  doMisterXMove: function(handler, inSpeech) {
    const locations = handler.attributes["locations"] || [];
    const history = handler.attributes["history"] || [];

    // TODO: game logic here
    const xMove = 'bus';
    const xLocation = Math.floor(Math.random() * 198) + 1;
    const xIsVisible = false;

    // save location
    locations[0] = xLocation;
    handler.attributes["locations"] = locations;
    // save history
    history.push({
      location: xLocation,
      move: xMove
    });
    handler.attributes["history"] = history;

    const speech = inSpeech || new Speech();
    speech.say('Mister X took the ' + xMove);
    speech.pause('1s');
    if (xIsVisible) {
      speech.say('Mister X is at ' + xLocation);
    }
    else {
      speech.say('Mister X is still invisible');
    }
    speech.pause('1s');

    this.startPlayerMove(handler, speech);
  },

  startPlayerMove: function(handler, inSpeech) {
    const player = handler.attributes["player"];

    const speech = inSpeech || new Speech();
    speech.say('Player ' + player + ', it\'s your move');
    speech.pause('1s');
    speech.say('Where do you go?');
    const speechOutput = speech.ssml(true);

    handler.emit(':askWithCard', speechOutput)    
  },

  playerMove: function (handler, type, location) {
    const player = handler.attributes["player"];
    const turn = handler.attributes["turn"];
    const locations = handler.attributes["locations"];

    // TODO: validate player move

    // TODO: check if player moved on top of Mister X

    locations[player] = location;
    handler.attributes["locations"] = locations;

    if (player < Consts.MAX_PLAYERS) {
      handler.attributes["player"] = player + 1;
      this.startPlayerMove(handler);
    }
    else if (turn < Consts.MAX_TURNS) {
      handler.attributes["turn"] = turn + 1;
      this.startTurn(handler);    
    }
    else {
      handler.emit('Game over, man! Game Over!');
    }
  }
}