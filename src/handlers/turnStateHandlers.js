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
    },

    'AMAZON.HelpIntent': function () {
        this.handler.state = Consts.GAME_STATES.HELP;
        this.emitWithState('helpTheUser', false);
    },
    'Unhandled': function () {
        const speechOutput = `Just play the game`;
        this.emit(':ask', speechOutput, speechOutput);
    },
    'SessionEndedRequest': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    }
});