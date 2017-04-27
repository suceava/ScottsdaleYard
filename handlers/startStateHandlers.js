const Alexa = require('alexa-sdk');
const Consts = require('../consts.js');
const Game = require('../game/gameFlow.js');

module.exports = Alexa.CreateStateHandler(Consts.GAME_STATES.START, {
    'Start': function (newGame) {
        Game.start(this);
    },
    'AMAZON.YesIntent': function () {
        Game.start(this);
    },

    'AMAZON.HelpIntent': function () {
        this.handler.state = Consts.GAME_STATES.HELP;
        this.emitWithState('helpTheUser', true);
    },
    'Unhandled': function () {
        this.emit('StartGame', true);
    },
    'SessionEndedRequest': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    }
});
