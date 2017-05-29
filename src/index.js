'use strict';

const Alexa = require('alexa-sdk');
const Speech = require('ssml-builder');
const Consts = require('./consts.js');
const startStateHandlers = require('./handlers/startStateHandlers.js');
const gameStateHandlers = require('./handlers/gameStateHandlers.js');
const turnStateHandlers = require('./handlers/turnStateHandlers.js');
const helpHandlers = require('./handlers/helpHandlers.js');
const GameState = require('./game/gameState.js');

const newSessionHandlers = {
  /**
   * Entry point. Start a new game on new session. Handle any setup logic here.
   */
  'NewSession': function () {
    if (this.event.request.type === 'LaunchRequest') {
      this.handler.state = Consts.GAME_STATES.START;
      this.emit(':ask', `Welcome to ${Consts.GAME_NAME}. Are you ready to catch some bad hombres? `);
    }
    else if (this.event.request.type === 'IntentRequest') {
      // skill started with an intent => try to load state from DB
      const intent = this.event.request.intent.name;
      console.log(`current intent: ${intent}, current state:${this.handler.state}`);

      new GameState()
        .load(this)
        .then((state) => {
          if (state.turn > 0) {
            // already in turn mode
            this.handler.state = Consts.GAME_STATES.TURN;
            this.emitWithState(intent);
          }
          else {
            // turn 0 means game hasn't started
            this.handler.state = Consts.GAME_STATES.START;
            this.emit(':ask', `Welcome back to ${Consts.GAME_NAME}. Are you ready to catch some bad hombres? `);
          }
        })
        .catch((err) => {
          // can't load state from DB
          this.handler.state = Consts.GAME_STATES.START;
          this.emitWithState(intent);
        });
    }
  },

  'SessionEndedRequest': function () {
    const speechOutput = 'OK, Goodbye!';
    this.emit(':tell', speechOutput);
  },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(
        newSessionHandlers, 
        startStateHandlers, 
        gameStateHandlers, 
        turnStateHandlers, 
        helpHandlers);
    alexa.APP_ID = Consts.APP_ID;
    alexa.execute();
};
