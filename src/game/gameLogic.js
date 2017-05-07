/*
The `positions` array parameter passed to these functions contains the positions of all players
  Mr X position is at index 0, Player 1 at index 1, and so on
*/
module.exports = {
  // returns an array with the starting positions of Mr X and the 4 players
  getStartingPositions: function() {
    return [1, 2, 3, 4, 5];
  },

  // move Mr. X and return his move
  moveMrX: function(positions, turn) {
    return {
      position: positions[0] + 1,
      move: 'bus',
      isVisible: false
    };
  },

  // returns a boolean indicating if a player can move from startPostion to endPosition
  isMoveValid: function(startPosition, endPosition) {
    return Math.abs(startPosition - endPosition) <= 2;
  },

  // returns a boolean indicating if Mr X was caught
  isMrXCaught: function(positions) {
    for (let i=1; i<=4; i++) {
      if (positions[0] === positions[i]) {
        return true;
      }
    }
    return false;
  }
}