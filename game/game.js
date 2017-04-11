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
    speech.say('Ready for round 1?');    

    const speechOutput = speech.ssml(true);

    handler.attributes["round"] = 1;
    handler.emit(':askWithCard', speechOutput, speechOutput, Consts.GAME_NAME, speechOutput);
  },

  startRound: function(handler) {
    const round = handler.attributes["round"];

    handler.attributes["player"] = 1;
    this.startPlayerMove(handler, 'Starting round ' + round);
  },

  startPlayerMove: function(handler, otherMessage) {
    const player = handler.attributes["player"];

    const speech = new Speech();
    if (otherMessage) {
      speech.say(otherMessage);
      speech.pause('1s');
    }
    speech.say('Player ' + player + ', it\'s your move');
    speech.pause('1s');
    speech.say('Where do you go?');
    const speechOutput = speech.ssml(true);

    handler.emit(':askWithCard', speechOutput)    
  },

  playerMove: function (handler, type, location) {
    const player = handler.attributes["player"];
    const round = handler.attributes["round"];

    if (player < 4) {
      handler.attributes["player"] = player + 1;
      this.startPlayerMove(handler);
    }
    else if (round < 2) {
      handler.attributes["round"] = round + 1;
      this.startRound(handler);    
    }
    else {
      this.emit('Game over, man! Game Over!');
    }
  }
}