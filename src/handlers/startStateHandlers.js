const Alexa = require('alexa-sdk');
const Consts = require('../consts.js');
const GameFlow = require('../game/gameFlow.js');

module.exports = Alexa.CreateStateHandler(Consts.GAME_STATES.START, {
    'Start': function (newGame) {
        GameFlow.start(this);
    },
    'AMAZON.YesIntent': function () {
        GameFlow.start(this);
    },

    'PlayerMoveTaxi': function () {
        if (this.attributes["turn"]) {
            this.handler.state = Consts.GAME_STATES.TURN;
            this.emitWithState('PlayerMoveTaxi', true);
        }
        else {
            // game not started
            this.emitWithState('Start', true);
        }
    },
    'PlayerMoveBus': function () {
        this.handler.state = Consts.GAME_STATES.TURN;
        this.emitWithState('PlayerMoveBus', true);
    },
    'PlayerMoveTrain': function () {
        this.handler.state = Consts.GAME_STATES.TURN;
        this.emitWithState('PlayerMoveTrain', true);
    },
    'PlayerMoveAny': function () {
        this.handler.state = Consts.GAME_STATES.TURN;
        this.emitWithState('PlayerMoveAny', true);
    },

    'AMAZON.HelpIntent': function () {
        this.handler.state = Consts.GAME_STATES.HELP;
        this.emitWithState('helpTheUser', true);
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
