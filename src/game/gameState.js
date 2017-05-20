const Dynasty = require('dynasty')({});

const ATTR_NAME = "game_state";

function GameState(handler) {
  const state = handler ? handler.attributes[ATTR_NAME] : {};

  this.positions = state.positions || [];
  this.history = state.history || [];
  this.turn = state.turn || 0;
  this.player = state.player || 0;
}

GameState.prototype.addHistory = function(player, position, transportation) {
  const turnHistory = this.history[this.turn] || [];
  turnHistory[player] = {
    position: position,
    transportation: transportation
  };
  this.history[this.turn] = turnHistory;
}

GameState.prototype.save = function(handler) {
  handler.attributes[ATTR_NAME] = this;
}

GameState.prototype.load = function() {

}

module.exports = GameState;
