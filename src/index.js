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
    // load the game state
    new GameState()
      .load(this)
      .then((state) => {
        if (state.turn === 0) {
          // turn 0 means game hasn't started
          this.handler.state = Consts.GAME_STATES.START;
          this.attributes['ask_continue'] = false;
          this.emit(':ask', `Welcome to ${Consts.GAME_NAME}. Are you ready to catch some bad hombres? `);
        }
        else {
          // already in turn mode

          if (this.event.request.type === 'LaunchRequest') {
            // just launched => ask if they want to continue
            this.handler.state = Consts.GAME_STATES.START;
            this.attributes['ask_continue'] = true;
            this.emit(':ask', `Welcome back to ${Consts.GAME_NAME}. You have a game in progress, would you like to continue that game?`);
          }
          else if (this.event.request.type === 'IntentRequest') {
            // skill started with an intent => continue saved game
            const intent = this.event.request.intent.name;
            console.log(`current intent: ${intent}, current state:${this.event.request.intent.slots}`);

            this.handler.state = Consts.GAME_STATES.TURN;
            this.emitWithState(intent);
          }
        }
      })
      .catch((err) => {
        // can't load state from DB
        this.handler.state = Consts.GAME_STATES.START;
        this.emitWithState(intent);
      });
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
    alexa.appId = process.env.ALEXA_APP_ID;
    alexa.execute();
};
