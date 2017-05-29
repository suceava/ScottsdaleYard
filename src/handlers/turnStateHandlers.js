const Alexa = require('alexa-sdk');
const Consts = require('../consts.js');
const GameFlow = require('../game/gameFlow.js');
const Game = require('../game/gameLogic.js');

module.exports = Alexa.CreateStateHandler(Consts.GAME_STATES.TURN, {
    'PlayerMoveTaxi': function () {
      const position = parseInt(this.event.request.intent.slots.position.value);
      GameFlow.playerMove(this, position, Game.CONSTS.TRANSPORTATION.TAXI);
    },
    'PlayerMoveBus': function () {
      const position = parseInt(this.event.request.intent.slots.position.value);
      GameFlow.playerMove(this, position, Game.CONSTS.TRANSPORTATION.BUS);
    },
    'PlayerMoveTrain': function () {
      const position = parseInt(this.event.request.intent.slots.position.value);
      GameFlow.playerMove(this, position, Game.CONSTS.TRANSPORTATION.TRAIN);
    },
    'PlayerMoveAny': function () {
      const position = parseInt(this.event.request.intent.slots.position.value);
      GameFlow.playerMove(this, position);
    },

    'AMAZON.HelpIntent': function () {
        this.handler.state = Consts.GAME_STATES.HELP;
        this.emitWithState('helpTheUser', false);
    },
    'Unhandled': function () {
        const speechOutput = `Just play the game`;
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    },
    'SessionEndedRequest': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    }
});