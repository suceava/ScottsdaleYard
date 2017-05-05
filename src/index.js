'use strict';

const Alexa = require('alexa-sdk');
const Speech = require('ssml-builder');
const Consts = require('./consts.js');
const startStateHandlers = require('./handlers/startStateHandlers.js');
const gameStateHandlers = require('./handlers/gameStateHandlers.js');
const helpHandlers = require('./handlers/helpHandlers.js');

const newSessionHandlers = {
    /**
     * Entry point. Start a new game on new session. Handle any setup logic here.
     */
    'NewSession': function () {
        this.handler.state = Consts.GAME_STATES.START;
        if (this.event.request.type === 'LaunchRequest') {
            this.emit(':ask', `Welcome to ${Consts.GAME_NAME}. Are you ready to catch some bad hombres? `);
        } 
        else if (this.event.request.type === 'IntentRequest') {
            console.log(`current intent: ${this.event.request.intent.name}, current state:${this.handler.state}`);
            const intent = this.event.request.intent.name;
            this.emitWithState(intent);
        }
    },

    'SessionEndedRequest': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startStateHandlers, gameStateHandlers, helpHandlers);
    alexa.APP_ID = Consts.APP_ID;
    alexa.execute();
};
