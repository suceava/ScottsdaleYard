const credentials = {
  region: 'us-east-1'
};
const dynasty = require('dynasty')(credentials, process.env.AWS_ACCESS_KEY_ID ? undefined : 'http://localhost:8000');

const TABLE_NAME = 'ScottsdaleYard';
const TABLE_NAME_HISTORY = 'ScottsdaleYardHistory';
const ATTR_NAME = 'game_state';

function GameState(handler) {
  const state = handler ? handler.attributes[ATTR_NAME] : {};

  this.positions = state.positions || [];
  this.history = state.history || [];
  this.turn = state.turn || 0;
  this.player = state.player || 0;
  this.ai = state.ai || 0;
  this.mrx = state.mrx || {
    speed_tokens: 2,
    potential_positions: []
  };
}

//#region private methods

function _stateTable() {
  return _dynamoTable(TABLE_NAME, {
      key_schema: {
        hash: ['UserID', 'string']
      }
    });
}
function _historyTable() {
  return _dynamoTable(TABLE_NAME_HISTORY, {
      key_schema: {
        hash: ['UserID', 'string'],
        sort: ['GameTimestamp', 'string']
      }
    });
}
function _dynamoTable(tableName, schema) {
  return dynasty.list()
    .then((response) => {
      if (response.TableNames.indexOf(tableName) === -1) {
        // table doesn't exist => create the table
        return dynasty
          .create(tableName, schema)
          .return(dynasty.table(tableName));
      }
      else {
        // table exists
        return dynasty.table(tableName);
      }
    })
    .catch((err) => {
      //TODO:
      console.log('Error in gameState._dynamoTable');
      console.log(err);
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
  return _stateTable()
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

GameState.prototype.saveHistoryDb = function(userId) {
  return _historyTable()
    .then((tbl) => {
      return tbl.insert({
        UserID: userId,
        GameTimestamp: new Date().toISOString(),
        State: JSON.stringify(this)
      });
    })
    .catch((err) => {
      //TODO:
      console.log('Error in gameState.saveHistoryDb');
      console.log(err);
    });
}

GameState.prototype.load = function(handler) {
  return this.loadDb(handler.event.session.user.userId)
    .then((data) => {
      if (data) {
        const state = JSON.parse(data.State);

        this.positions = state.positions;
        this.history = state.history;
        this.turn = state.turn;
        this.player = state.player;
        this.ai = state.ai;
        if (state.mrx) {
          this.mrx.speed_tokens = state.mrx.speed_tokens;
          this.mrx.potential_positions = state.mrx.potential_positions;
        }

        handler.attributes[ATTR_NAME] = this;
      }

      return this;
    })
    .catch((err) => {
      //TODO:
      console.log('Error in gameState.load');
      console.log(err);
    });
}
GameState.prototype.loadDb = function(userId) {
  return _stateTable()
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
