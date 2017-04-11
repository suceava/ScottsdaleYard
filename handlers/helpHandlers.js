const Alexa = require('alexa-sdk');
const Consts = require('../consts.js');

module.exports = Alexa.CreateStateHandler(Consts.GAME_STATES.HELP, {
    'helpTheUser': function (newGame) {
        // const askMessage = newGame ? 'Would you like to start playing?' : 'To repeat the last question, say, repeat. Would you like to keep playing?';
        // const speechOutput = `I will ask you ${GAME_LENGTH} multiple choice questions. Respond with the number of the answer. `
        //     + `For example, say one, two, three, or four. To start a new game at any time, say, start game. ${askMessage}`;
        // const repromptText = `To give an answer to a question, respond with the number of the answer . ${askMessage}`;

        // this.emit(':ask', speechOutput, repromptText);
        this.emit(':ask', 'help me help you');
    },
    'Start': function () {
        this.handler.state = Consts.GAME_STATES.START;
        this.emitWithState('Start', false);
    },
    'AMAZON.RepeatIntent': function () {
        this.emitWithState('helpTheUser');
    },
    'AMAZON.HelpIntent': function () {
        this.emitWithState('helpTheUser', false);
    },
    'AMAZON.YesIntent': function () {
        if (this.attributes.speechOutput && this.attributes.repromptText) {
            this.handler.state = Consts.GAME_STATES.TRIVIA;
            this.emitWithState('AMAZON.RepeatIntent');
        } else {
            this.handler.state = Consts.GAME_STATES.START;
            this.emitWithState('StartGame', false);
        }
    },
    'AMAZON.NoIntent': function () {
        const speechOutput = 'Ok, let me know when you are ready to play next time. Goodbye!';
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        const speechOutput = 'Would you like to keep playing?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.handler.state = Consts.GAME_STATES.TRIVIA;
        this.emitWithState('AMAZON.RepeatIntent');
    },
    'Unhandled': function () {
        const speechOutput = 'Say yes to continue, or no to end the game.';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'SessionEndedRequest': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    }
});
