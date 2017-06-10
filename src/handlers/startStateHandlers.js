const Alexa = require('alexa-sdk');
const Consts = require('../consts.js');
const GameFlow = require('../game/gameFlow.js');

module.exports = Alexa.CreateStateHandler(Consts.GAME_STATES.START, {
    'Start': function (newGame) {
        GameFlow.start(this);
    },
    'AMAZON.YesIntent': function () {
        if (this.attributes['ask_continue']) {
            // Yes, continue saved game
            GameFlow.continue(this);
        }
        else {
            // Yes, start fresh game
            GameFlow.start(this);
        }
    },
    'AMAZON.NoIntent': function () {
        // No, do not continue saved game
        GameFlow.start(this);
    },

    'AMAZON.HelpIntent': function () {
        this.handler.state = Consts.GAME_STATES.HELP;
        this.emitWithState('helpTheUser', true);
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
