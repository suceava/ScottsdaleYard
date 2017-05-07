const Alexa = require('alexa-sdk');
const Consts = require('../consts.js');
const GameFlow = require('../game/gameFlow.js');

module.exports = Alexa.CreateStateHandler(Consts.GAME_STATES.TURN, {
    'PlayerMoveTaxi': function () {
      const position = parseInt(this.event.request.intent.slots.position.value);
      GameFlow.playerMove(this, 'taxi', position);
    },
    'PlayerMoveBus': function () {
      const position = parseInt(this.event.request.intent.slots.position.value);
      GameFlow.playerMove(this, 'bus', position);
    },
    'PlayerMoveTrain': function () {
      const position = parseInt(this.event.request.intent.slots.position.value);
      GameFlow.playerMove(this, 'train', position);
    }
});