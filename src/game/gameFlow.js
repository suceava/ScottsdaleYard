const Alexa = require('alexa-sdk');
const Speech = require('ssml-builder');
const Consts = require('../consts.js');
const Game = require('./gameLogic.js');
const GameState = require('./gameState.js');

const TRANSPORTATION_STRINGS = ['taxi', 'bus', 'train', 'boat'];

module.exports = {
  start: function(handler) {
    // set game mode
    handler.handler.state = Consts.GAME_STATES.GAME;

    const state = new GameState();

    // pick an AI
    state.ai = Game.CONSTS.AI.EASY;

    // get starting positions
    // MrX is at index 0
    state.positions = Game.getStartingPositions();

    const speech = new Speech();
    speech.say('OK, lets get started');
    speech.pause('1s');
    speech.say('Mister X is currently invisible');
    for (let i = 1; i < state.positions.length; i++) {
      speech.pause('1s');
      speech.say(`Player ${i} starts at ${state.positions[i]}`);
    }
    speech.pause('1s');
    speech.say('Ready for turn 1?');    

    const speechOutput = speech.ssml(true);

    // save starting history
    for (let i = 0; i < state.positions.length; i++) {
      state.addHistory(i, state.positions[i], -1);
    }
    // set turn
    state.turn = 1;

    state.save(handler)
      .then((response) => {
        handler.emit(':askWithCard', speechOutput, speechOutput, Consts.GAME_NAME, speechOutput);
      })
      .catch((err) => {
        //TODO:
        console.log('Error in gameFlow.start');
        console.log(err);
      });
  },

  continue: function(handler) {
    // continue saved game => re-iterate game state before continuing turn
    handler.handler.state = Consts.GAME_STATES.TURN;

    const state = new GameState(handler);

    const speech = new Speech();
    speech.say(`It is turn ${state.turn}`);
    speech.pause('1s');
    if (Game.CONSTS.MRX_VISIBLE_TURNS.indexOf(state.turn) >= 0) {
      speech.say(`Mister X is at ${state.position[0]}`);
    }
    else {
      speech.say(`Mister X is invisible`);
      // TODO: should say where last seen?
    }
    speech.pause('1s');
    for (let i = 1; i < state.positions.length; i++) {
      speech.pause('1s');
      speech.say(`Player ${i} is at ${state.positions[i]}`);
    }
    speech.pause('1s');

    this.startPlayerMove(handler, speech);
  },

  startTurn: function(handler) {
    // start new turn
    handler.handler.state = Consts.GAME_STATES.TURN;

    const state = new GameState(handler);
    state.player = 1;

    const speech = new Speech();
    speech.say(`Starting turn ${state.turn}`);
    speech.pause('1s');
    
    state.save(handler)
      .then((response) => {
        this.doMisterXMove(handler, speech);
      })
      .catch((err) => {
        //TODO:
        console.log('Error in gameFlow.startTurn');
        console.log(err);
      });
  },

  doMisterXMove: function(handler, inSpeech) {
    const state = new GameState(handler);

    // move Mr X
    const mrx = Game.moveMrX2(state.positions, state.turn);
    if (mrx.dead) {
      // Mr.X cannot safely move
      this.completeGame(state, handler, true);
      return;
    }

    // save position
    state.positions[0] = mrx.position;
    // save history
    state.addHistory(0, mrx.position, mrx.transportation);

    const speech = inSpeech || new Speech();
    speech.say(`Mister X took the ${TRANSPORTATION_STRINGS[mrx.transportation]}`);
    speech.pause('1s');
    if (mrx.isVisible) {
      speech.say(`Mister X is at ${mrx.position}`);
    }
    else {
      speech.say('Mister X is invisible');
    }
    speech.pause('1s');

    state.save(handler)
      .then((response) => {
        this.startPlayerMove(handler, speech);
      })
      .catch((err) => {
        //TODO:
        console.log('Error in gameFlow.doMisterXMove');
        console.log(err);
      });
  },

  startPlayerMove: function(handler, inSpeech) {
    const state = new GameState(handler);

    const speech = inSpeech || new Speech();
    speech.say(`Player ${state.player}, it's your move.`);
    speech.pause('1s');
    speech.say('Where do you go?');
    const speechOutput = speech.ssml(true);

    handler.emit(':askWithCard', speechOutput)    
  },

  doPlayerMove: function(handler, position, transportation) {
    const state = new GameState(handler);
    let localTransportation = transportation;

    // validate player move
    const currentPosition = state.positions[state.player];
    let isMoveValid = false;
    if (typeof transportation === 'undefined') {
      // loop through transportations, lowest to highest, and try to find a valid move
      const ts = [Game.CONSTS.TRANSPORTATION.TAXI, Game.CONSTS.TRANSPORTATION.BUS, Game.CONSTS.TRANSPORTATION.TRAIN];
      for (let i = 0; i < ts.length; i++) {
        localTransportation = ts[i];
        if (Game.isMoveValid(currentPosition, position, localTransportation)) {
          isMoveValid = true;
          break;
        }
      }
    }
    else {
      // specific transportation
      isMoveValid = Game.isMoveValid(currentPosition, position, localTransportation);
    }

    if (!isMoveValid) {
      // move is invalid
      const transportationString = (typeof transportation !== 'undefined') ? ` by ${TRANSPORTATION_STRINGS[transportation]}` : ''
      const speech = new Speech();
      speech.say(`Player ${state.player}, you cannot move from ${currentPosition} to ${position}${transportationString}`);
      speech.pause('1s');
      this.startPlayerMove(handler, speech);
      return;
    }

    // record the move
    state.positions[state.player] = position;

    // save history
    state.addHistory(state.player, position, localTransportation);

    // check if player moved on top of Mister X
    if (Game.isMrXCaught(state.positions)) {
      // Mr X is done
      this.completeGame(state, handler, true);
      return;
    }

    if (state.player < Game.CONSTS.MAX_PLAYERS) {
      state.player++;
      state.save(handler)
        .then((response) => {
          this.startPlayerMove(handler);
        })
        .catch((err) => {
          //TODO:
          console.log(err);
        });
    }
    else if (state.turn < Game.CONSTS.MAX_TURNS) {
      state.turn++;
      state.save(handler)
        .then((response) => {
          this.startTurn(handler);    
        })
        .catch((err) => {
          //TODO:
          console.log(err);
        });
    }
    else {
      // finished all turns
      this.completeGame(state, handler, false);
    }
  },

  completeGame: function(state, handler, mrXisCaught) {
    // record the game history
    state.saveHistoryDb(handler.event.session.user.userId);

    if (mrXisCaught) {
      // win
      handler.emit(':tell', 'Congratulations! You caught Mr. X');
    }
    else {
      // loss
      handler.emit(':tell', 'Sorry, you failed to catch Mr. X in time');
    }
  }
}