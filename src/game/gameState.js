const credentials = {};
const dynasty = require('dynasty')(credentials, 'http://localhost:8000');

const TABLE_NAME = 'ScottsdaleYard';
const ATTR_NAME = 'game_state';

function GameState(handler) {
  const state = handler ? handler.attributes[ATTR_NAME] : {};

  this.positions = state.positions || [];
  this.history = state.history || [];
  this.turn = state.turn || 0;
  this.player = state.player || 0;
}

//#region private methods

function _dynamoTable() {
  return dynasty.list()
    .then((response) => {
      if (response.TableNames.indexOf(TABLE_NAME) === -1) {
        // table doesn't exist => create the table
        return dynasty
          .create(TABLE_NAME, {
            key_schema: {
              hash: ['UserID', 'string']
            }
          })
          .return(dynasty.table(TABLE_NAME));
      }
      else {
        // table exists
        return dynasty.table(TABLE_NAME);
      }
    });
}

// we have to wait for table to be created
// see example: http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LowLevelDotNetTableOperationsExample.html
function _waitForTable() {
  //TODO: I don't think this is worth doing at this point just for development
  // we can just create the table in production and assume it's always there
}

//#endregion

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

  return this.saveDb(handler.event.session.user.userId);
}

GameState.prototype.saveDb = function(userId) {
  return _dynamoTable()
    .then((tbl) => {
      // insert seems to overwrite existing record which is ok for us
      return tbl.insert({
        UserID: userId,
        State: JSON.stringify(this)
      });
    })
    .catch((err) => {
      //TODO:
      console.log('Error in gameState.saveDb');
      console.log(err);
    });
}

GameState.prototype.load = function(handler) {
  return this.loadDb(handler.event.session.user.userId)
    .then((data) => {
      console.log('load');
      console.log(data);
      if (data) {
        const state = JSON.parse(data.State);

        this.positions = state.positions;
        this.history = state.history;
        this.turn = state.turn;
        this.player = state.player;

        handler.attributes[ATTR_NAME] = this;
      }

      return this;
    })
    .catch((err) => {
      //TODO:
      console.log('Error in gameState.load');
      console.log(err);
    });
},
GameState.prototype.loadDb = function(userId) {
  return _dynamoTable()
    .then((tbl) => {
      return tbl.find(userId);
    })
    .catch((err) => {
      //TODO:
      console.log('Error in gameState.loadDb');
      console.log(err);
    });
}

module.exports = GameState;
