const Alexa = require('alexa-sdk');
const Speech = require('ssml-builder');
const Consts = require('../consts.js');
const Game = require('./gameLogic.js');

const TRANSPORTATION_STRINGS = ['taxi', 'bus', 'train', 'boat'];

function addHistory(history, turn, player, position, move) {
  const turnHistory = history[turn] || [];
  turnHistory[player] = {
    position: position,
    move: move
  };
  history[turn] = turnHistory;
}

module.exports = {
  start: function(handler) {
    // set game mode
    handler.handler.state = Consts.GAME_STATES.GAME;

    // get starting positions
    // MrX is at index 0
    const positions = Game.getStartingPositions();

    const speech = new Speech();
    speech.say('OK, lets get started');
    speech.pause('1s');
    speech.say('Mister X is currently invisible');
    for (let i=1; i<positions.length; i++) {
      speech.pause('1s');
      speech.say(`Player ${i} starts at ${positions[i]}`);
    }
    speech.pause('1s');
    speech.say('Ready for turn 1?');    

    const speechOutput = speech.ssml(true);

    // save starting history
    const history = [];
    for (let i=0; i<positions.length; i++) {
      addHistory(history, 0, i, positions[i], 'start');
    }
    handler.attributes["positions"] = positions;
    handler.attributes["history"] = history;
    handler.attributes["turn"] = 1;
    handler.emit(':askWithCard', speechOutput, speechOutput, Consts.GAME_NAME, speechOutput);
  },

  startTurn: function(handler) {
    handler.handler.state = Consts.GAME_STATES.TURN;

    const turn = handler.attributes["turn"];
    handler.attributes["player"] = 1;

    const speech = new Speech();
    speech.say(`Starting turn ${turn}`);
    speech.pause('1s');
    
    this.doMisterXMove(handler, speech);
  },

  doMisterXMove: function(handler, inSpeech) {
    const positions = handler.attributes["positions"] || [],
          history = handler.attributes["history"] || [],
          turn = handler.attributes["turn"];

    // move Mr X
    const mrx = Game.moveMrX(positions, turn);

    // save position
    positions[0] = mrx.position;
    handler.attributes["positions"] = positions;
    // save history
    addHistory(history, turn, 0, mrx.position, mrx.transportation);
    handler.attributes["history"] = history;

    const speech = inSpeech || new Speech();
    speech.say(`Mister X took the ${TRANSPORTATION_STRINGS[mrx.transportation]}`);
    speech.pause('1s');
    if (mrx.isVisible) {
      speech.say(`Mister X is at ${mrx.position}`);
    }
    else {
      speech.say('Mister X is still invisible');
    }
    speech.pause('1s');

    this.startPlayerMove(handler, speech);
  },

  startPlayerMove: function(handler, inSpeech) {
    const player = handler.attributes["player"];

    const speech = inSpeech || new Speech();
    speech.say(`Player ${player}, it's your move.`);
    speech.pause('1s');
    speech.say('Where do you go?');
    const speechOutput = speech.ssml(true);

    handler.emit(':askWithCard', speechOutput)    
  },

  playerMove: function (handler, position, transportation) {
    const player = handler.attributes["player"],
          turn = handler.attributes["turn"],
          positions = handler.attributes["positions"],
          history = handler.attributes["history"];
    let localTransportation = transportation;

    // validate player move
    const currentPosition = positions[player];
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
      speech.say(`Player ${player}, you cannot move from ${currentPosition} to ${position}${transportationString}`);
      speech.pause('1s');
      this.startPlayerMove(handler, speech);
      return;
    }

    // record the move
    positions[player] = position;
    handler.attributes["positions"] = positions;

    // save history
    addHistory(history, turn, player, position, localTransportation);
    handler.attributes["history"] = history;

    // check if player moved on top of Mister X
    if (Game.isMrXCaught(positions)) {
      // Mr X is done
      handler.emit(':tell', 'Congratulations! You caught Mr. X');
      return;
    }

    if (player < Game.CONSTS.MAX_PLAYERS) {
      handler.attributes["player"] = player + 1;
      this.startPlayerMove(handler);
    }
    else if (turn < Game.CONSTS.MAX_TURNS) {
      handler.attributes["turn"] = turn + 1;
      this.startTurn(handler);    
    }
    else {
      handler.emit(':tell', 'Game over, man! Game Over!');
    }
  }
}