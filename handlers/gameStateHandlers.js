const Alexa = require('alexa-sdk');
const Consts = require('../consts.js');
const Game = require('../game/game.js');

module.exports = Alexa.CreateStateHandler(Consts.GAME_STATES.GAME, {
    'Start': function () {
      Game.startRound(this);
    },
    'AMAZON.YesIntent': function () {
      Game.startRound(this);
    },

    'PlayerMoveTaxi': function () {
      const location = parseInt(this.event.request.intent.slots.location.value);
      Game.playerMove(this, 'taxi', location);
    },
    'PlayerMoveBus': function () {
      const location = parseInt(this.event.request.intent.slots.location.value);
      Game.playerMove(this, 'bus', location);
    },
    'PlayerMoveTrain': function () {
      const location = parseInt(this.event.request.intent.slots.location.value);
      Game.playerMove(this, 'train', location);
    },

    'AMAZON.StartOverIntent': function () {
        this.handler.state = Consts.GAME_STATES.START;
        this.emitWithState('StartGame', false);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptText);
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = Consts.GAME_STATES.HELP;
        this.emitWithState('helpTheUser', false);
    },
    'AMAZON.StopIntent': function () {
        this.handler.state = Consts.GAME_STATES.HELP;
        const speechOutput = 'Would you like to keep playing?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Ok, let\'s play again soon.');
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
