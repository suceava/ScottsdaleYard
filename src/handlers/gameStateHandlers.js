const Alexa = require('alexa-sdk');
const Consts = require('../consts.js');
const GameFlow = require('../game/gameFlow.js');

module.exports = Alexa.CreateStateHandler(Consts.GAME_STATES.GAME, {
    'Start': function () {
      GameFlow.startTurn(this);
    },
    'AMAZON.YesIntent': function () {
      GameFlow.startTurn(this);
    },

    'AMAZON.StartOverIntent': function () {
        this.handler.state = Consts.GAME_STATES.START;
        this.emitWithState('StartGame', false);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptText);
    },
    'AMAZON.StopIntent': function () {
        this.handler.state = Consts.GAME_STATES.HELP;
        const speechOutput = 'Would you like to keep playing?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Ok, let\'s play again soon.');
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
