/*
The `positions` array parameter passed to these functions contains the positions of all players
  Mr X position is at index 0, Player 1 at index 1, and so on
*/
module.exports = {
  CONSTS: {
    MAX_PLAYERS: 2,
    MAX_TURNS: 2,
    TRANSPORTATION: {
      TAXI: 0,
      BUS: 1,
      TRAIN: 2,
      BOAT: 3
    },
    PLAYER_STARTING_POSITIONS: [13,26,29,34,50,53,91,94,103,112,117,123,138,141,155,174],
    MRX_STARTING_POSITIONS: [35,45,51,71,78,104,106,127,132,146,166,170,172],

    //#region nodes

    // The first level of the array below defines the LocationNumber (hence no location zero).
    // The second level of the array is an array of [a,b] where:
    //   a) is the node that is connected and
    //   b) is the roadtype:  0 is taxi, 1 is bus, 2 is train, 3 is boat
    //
    // Thus, [8,1] represents a connection to Location 8 via a bus
    NODES:
      // 0 - 4
      [[],
      [[8,0],[9,0],[46,1],[58,1],[46,2]],
      [[20,0],[10,0]],
      [[4,0],[11,0],[12,0],[22,1],[23,1]],
      [[3,0],[13,0]],
      // 5 - 9
      [[15,0],[16,0]],
      [[7,0],[29,0]],
      [[6,0],[17,0],[42,1]],
      [[1,0],[18,0],[19,0]],
      [[1,0],[19,0],[20,0]],
      // 10 - 14
      [[2,0],[11,0],[21,0],[34,0]],
      [[3,0],[10,0],[22,0]],
      [[3,0],[23,0]],
      [[4,0],[23,0],[24,0],[14,1],[23,1],[52,1],[46,2],[67,2],[89,2]],
      [[15,0],[25,0],[13,1],[15,1]],
      // 15 - 19
      [[5,0],[14,0],[16,0],[26,0],[28,0],[14,1],[29,1],[41,1]],
      [[5,0],[15,0],[28,0],[29,0]],
      [[7,0],[29,0],[30,0]],
      [[8,0],[31,0],[43,0]],
      [[8,0],[9,0],[32,0]],
      // 20 - 24
      [[2,0],[9,0],[33,0]],
      [[10,0],[33,0]],
      [[11,0],[23,0],[34,0],[35,0],[3,1],[23,1],[34,1],[65,1]],
      [[12,0],[13,0],[22,0],[37,0],[3,1],[13,1],[22,1],[67,1]],
      [[13,0],[37,0],[38,0]],
      // 25 - 29
      [[14,0],[38,0],[39,0]],
      [[15,0],[27,0],[39,0]],
      [[26,0],[28,0],[40,0]],
      [[15,0],[16,0],[27,0],[41,0]],
      [[6,0],[16,0],[17,0],[41,0],[42,0],[15,1],[41,1],[42,1],[55,1]],
      // 30 - 34
      [[17,0],[42,0]],
      [[18,0],[43,0],[44,0]],
      [[19,0],[33,0],[44,0],[45,0]],
      [[20,0],[21,0],[32,0],[46,0]],
      [[10,0],[22,0],[47,0],[48,0],[22,1],[46,1],[63,1]],
      // 35 - 39
      [[22,0],[36,0],[48,0],[65,0]],
      [[35,0],[37,0],[49,0]],
      [[23,0],[24,0],[36,0],[50,0]],
      [[24,0],[25,0],[50,0],[51,0]],
      [[25,0],[26,0],[51,0],[52,0]],
      // 40 - 44
      [[27,0],[41,0],[52,0],[53,0]],
      [[28,0],[29,0],[40,0],[54,0],[15,1],[29,1],[52,1],[87,1]],
      [[29,0],[30,0],[56,0],[72,0],[7,1],[29,1],[72,1]],
      [[18,0],[31,0],[57,0]],
      [[31,0],[32,0],[58,0]],
      // 45 - 49
      [[32,0],[46,0],[58,0],[59,0],[60,0]],
      [[9,0],[45,0],[47,0],[61,0],[1,1],[34,1],[58,1],[78,1],[1,2],[13,2],[74,2],[79,2]],
      [[34,0],[46,0],[62,0]],
      [[34,0],[35,0],[62,0],[63,0]],
      [[36,0],[50,0],[66,0]],
      // 50 - 54
      [[37,0],[38,0],[49,0]],
      [[38,0],[39,0],[52,0],[67,0],[68,0]],
      [[39,0],[40,0],[51,0],[69,0],[13,1],[41,1],[67,1],[86,1]],
      [[40,0],[54,0],[69,0]],
      [[41,0],[53,0],[55,0],[70,0]],
      // 55 - 59
      [[54,0],[71,0],[29,1],[89,1]],
      [[42,0],[91,0]],
      [[43,0],[58,0],[73,0]],
      [[44,0],[45,0],[57,0],[59,0],[74,0],[1,1],[46,1],[74,1],[77,1]],
      [[45,0],[58,0],[75,0],[76,1]],
      // 60 - 64
      [[45,0],[61,0],[76,0]],
      [[46,0],[62,0],[76,0],[78,0]],
      [[47,0],[48,0],[61,0],[79,0]],
      [[48,0],[64,0],[79,0],[80,0],[34,1],[65,1],[79,1],[100,1]],
      [[63,0],[65,0],[81,0]],
      // 65 - 69
      [[35,0],[64,0],[66,0],[82,0],[22,1],[63,1],[67,1],[82,1]],
      [[49,0],[65,0],[67,0],[82,0]],
      [[51,0],[66,0],[68,0],[84,0],[23,1],[52,1],[65,1],[102,1],[13,2],[79,2],[89,2],[111,2]],
      [[51,0],[67,0],[69,0],[85,0]],
      [[52,0],[53,0],[68,0],[86,1]],
      // 70 - 74
      [[54,0],[71,0],[87,0]],
      [[55,0],[70,0],[72,0],[89,0]],
      [[42,0],[71,0],[90,0],[91,0],[42,1],[105,1],[107,1]],
      [[57,0],[74,0],[92,0]],
      [[58,0],[73,0],[92,0],[58,1],[94,1],[46,2]],
      // 75 - 79
      [[58,0],[59,0],[74,0],[94,0]],
      [[59,0],[61,0],[77,0]],
      [[76,0],[78,0],[95,0],[96,0],[58,1],[78,1],[94,1],[124,1]],
      [[61,0],[77,0],[79,0],[97,0],[46,1],[77,1],[79,1]],
      [[62,0],[63,0],[78,0],[98,0],[63,1],[78,1],[46,2],[67,2],[93,2],[111,2]],
      // 80 - 84
      [[63,0],[99,0],[100,0]],
      [[64,0],[82,0],[100,0]],
      [[65,0],[66,0],[81,0],[101,0],[65,1],[67,1],[100,1],[140,1]],
      [[101,0],[102,0]],
      [[67,0],[85,0]],
      // 85 - 89
      [[68,0],[84,0],[103,0]],
      [[69,0],[103,0],[104,0],[52,1],[87,1],[102,1],[116,1]],
      [[70,0],[88,0],[41,1],[86,1],[105,1]],
      [[87,0],[89,0],[117,0]],
      [[71,0],[88,0],[105,0],[55,1],[105,1],[13,2],[67,2],[140,2],[128,2]],
      // 90 - 94
      [[72,0],[91,0],[105,0]],
      [[56,0],[72,0],[90,0],[105,0],[107,0]],
      [[73,0],[74,0],[93,0]],
      [[92,0],[94,0],[94,1],[79,2]],
      [[75,0],[93,0],[95,0],[74,1],[77,1],[93,1]],
      // 95 - 99
      [[77,0],[94,0],[122,0]],
      [[77,0],[97,0],[109,0]],
      [[78,0],[96,0],[98,0],[109,0]],
      [[79,0],[97,0],[99,0],[110,0]],
      [[80,0],[98,0],[110,0],[112,0]],
      // 100 - 104
      [[80,0],[81,0],[101,0],[112,0],[113,0],[63,1],[82,1],[111,1]],
      [[82,0],[83,0],[100,0],[114,0]],
      [[83,0],[103,0],[115,0],[67,1],[86,1],[127,1]],
      [[85,0],[86,0],[102,0]],
      [[86,0],[116,0]],
      // 105 - 109
      [[89,0],[90,0],[91,0],[106,0],[108,0],[72,1],[87,1],[89,1],[107,1],[108,1]],
      [[105,0],[107,0]],
      [[91,0],[106,0],[119,0],[72,1],[105,1],[161,1]],
      [[105,0],[117,0],[119,0],[105,1],[116,1],[135,1],[115,3]],
      [[96,0],[97,0],[110,0],[124,0]],
      // 110 - 114
      [[98,0],[99,0],[109,0],[111,0]],
      [[110,0],[112,0],[124,0],[100,1],[124,1],[67,2],[79,2],[153,2],[163,2]],
      [[99,0],[100,0],[111,0],[125,0]],
      [[100,0],[114,0],[125,0]],
      [[101,0],[113,0],[115,0],[126,0],[131,0],[132,0]],
      // 115 - 119
      [[102,0],[114,0],[126,0],[127,0],[108,3],[157,3]],
      [[104,0],[117,0],[118,0],[127,0],[86,1],[108,1],[127,1],[142,1]],
      [[88,0],[108,0],[116,0],[129,0]],
      [[116,0],[129,0],[134,0],[142,1]],
      [[107,0],[108,0],[136,0]],
      // 120 - 124
      [[121,0],[144,0]],
      [[120,0],[122,0]],
      [[95,0],[121,0],[123,0],[146,0],[123,1],[144,1]],
      [[122,0],[124,0],[137,0],[148,0],[149,0],[122,1],[124,1],[144,1],[165,1]],
      [[109,0],[111,0],[123,0],[130,0],[138,0],[77,1],[111,1],[123,1],[153,1]],
      // 125 - 129
      [[112,0],[113,0],[131,0]],
      [[114,0],[115,0],[127,0],[140,0]],
      [[115,0],[116,0],[126,0],[133,0],[134,0],[102,1],[116,1],[133,1]],
      [[142,0],[143,0],[160,0],[172,0],[188,0],[135,1],[142,1],[161,1],[187,1],[199,1],[89,2],[140,2],[185,2]],
      [[117,0],[118,0],[135,0],[142,0],[143,0]],
      // 130 - 134
      [[124,0],[131,0],[139,0]],
      [[114,0],[125,0],[130,0]],
      [[114,0],[140,0]],
      [[127,0],[140,0],[141,0],[127,1],[140,1],[157,1]],
      [[118,0],[127,0],[141,0],[142,0]],
      // 135 - 139
      [[129,0],[136,0],[143,0],[161,0],[108,1],[128,1],[161,1]],
      [[119,0],[135,0],[162,0]],
      [[123,0],[147,0]],
      [[124,0],[150,0],[152,0]],
      [[130,0],[153,0],[154,0]],
      // 140 - 144
      [[126,0],[132,0],[133,0],[139,0],[154,0],[156,0],[82,1],[133,1],[154,1],[156,1],[89,2],[128,2],[153,2]],
      [[133,0],[134,0],[142,0],[158,0]],
      [[118,0],[128,0],[129,0],[134,0],[141,0],[143,0],[158,0],[116,1],[128,1],[157,1]],
      [[128,0],[135,0],[142,0],[160,0]],
      [[120,0],[145,0],[177,0],[122,1],[123,1],[163,1]],
      // 145 - 149
      [[121,0],[144,0],[146,0]],
      [[122,0],[145,0],[147,0],[163,0]],
      [[137,0],[146,0],[164,0]],
      [[123,0],[149,0],[164,0]],
      [[123,0],[148,0],[150,0],[165,0]],
      // 150 - 154
      [[138,0],[149,0],[151,0]],
      [[150,0],[152,0],[165,0],[166,0]],
      [[138,0],[151,0],[153,0]],
      [[139,0],[152,0],[154,0],[166,0],[167,0],[124,1],[154,1],[180,1],[184,1],[111,2],[140,2],[163,2],[185,2]],
      [[139,0],[140,0],[153,0],[155,0],[140,1],[153,1],[156,1]],
      // 155 - 159
      [[154,0],[156,0],[168,0]],
      [[140,0],[155,0],[157,0],[169,0],[140,1],[154,1],[157,1],[184,1]],
      [[156,0],[158,0],[170,0],[133,1],[142,1],[156,1],[185,1],[115,3],[194,3]],
      [[141,0],[142,0],[157,0],[159,0]],
      [[158,0],[170,0],[172,0],[186,0],[198,0]],
      // 160 - 164
      [[128,0],[143,0],[161,0],[173,0]],
      [[135,0],[160,0],[174,0],[107,1],[128,1],[135,1],[199,1]],
      [[136,0],[175,0]],
      [[146,0],[177,0],[144,1],[176,1],[191,1],[111,2],[153,2]],
      [[147,0],[148,0],[178,0],[179,0]],
      // 165 - 169
      [[149,0],[151,0],[179,0],[180,0],[123,1],[180,1],[191,1]],
      [[151,0],[153,0],[181,0],[183,0]],
      [[153,0],[155,0],[168,0],[183,0]],
      [[155,0],[167,0],[184,0]],
      [[156,0],[184,0]],
      // 170 - 174
      [[157,0],[159,0],[185,0]],
      [[173,0],[175,0],[199,0]],
      [[128,0],[159,0],[187,0]],
      [[160,0],[171,0],[174,0],[188,0]],
      [[161,0],[173,0],[175,0]],
      // 175 - 179
      [[162,0],[171,0],[174,0]],
      [[177,0],[189,0],[163,1],[190,1]],
      [[144,0],[163,0],[176,0]],
      [[164,0],[189,0],[191,0]],
      [[164,0],[165,0],[191,0]],
      // 180 - 184
      [[165,0],[181,0],[193,0],[153,1],[165,1],[184,1],[190,1]],
      [[166,0],[180,0],[182,0],[193,0]],
      [[181,0],[183,0],[195,0]],
      [[166,0],[167,0],[182,0],[196,0]],
      [[168,0],[169,0],[185,0],[196,0],[153,1],[156,1],[180,1],[185,1]],
      // 185 - 189
      [[170,0],[184,0],[186,0],[157,1],[184,1],[187,1],[153,2],[128,2]],
      [[159,0],[185,0],[198,0]],
      [[172,0],[188,0],[198,0],[128,1],[185,1]],
      [[128,0],[173,0],[187,0],[199,0]],
      [[176,0],[178,0],[190,0]],
      // 190 - 194
      [[189,0],[191,0],[192,0],[180,1],[176,1],[191,1]],
      [[178,0],[179,0],[190,0],[192,0],[163,1],[165,1],[190,1]],
      [[190,0],[191,0],[194,0]],
      [[180,0],[181,0],[194,0]],
      [[192,0],[193,0],[195,0],[157,3]],
      // 195 - 199
      [[182,0],[194,0],[197,0]],
      [[183,0],[184,0],[197,1]],
      [[184,0],[195,0],[196,0]],
      [[159,0],[186,0],[187,0]],
      [[171,0],[188,0],[198,0],[128,1],[161,1]]
    ]

    //#endregion
  },

  // returns an array with 200 integers.  
  // each integer represents the distance from that location to the input location
  _generateDistanceArray: function(location) {
    const distanceArray = Array(200).fill(999);

    this._discoverNode(location, 0, distanceArray);

    return distanceArray;
  },

  _discoverNode: function(location, distance, distanceArray) {
    distanceArray[location] = distance;

    const nodes = this._getNode(location);
    for (let i = 0; i < nodes.length; i++)
    {
      const nextLocation = nodes[i][0];
      if (distanceArray[nextLocation] > distance + 1) {
        this._discoverNode(nextLocation, distance + 1, distanceArray);
      }
    }
  },
  _getNode: function(position) {
    return this.CONSTS.NODES[position];
  },
  // takes two locations and returns the "best transportion type" where boat is best and taxi is worst
  _getBestTransportationType: function(loc1, loc2) {
    const nodes = this._getNode(loc1);
    const potentialNodes = [];
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i][0] == loc2) {
        potentialNodes.push(nodes[i][0], nodes[i][1]);
      }
    }

    // now get the highest transportation value in the connections that exist
    let transNumber = 0;
    for (let i = 0; i < potentialNodes.length; i++) {
      if (potentialNodes[i][1] > transNumber) {
        transNumber = potentialNodes[i][1];
      }
    }
    return transNumber;
  },

  // returns an array with the starting positions of Mr X and the players
  getStartingPositions: function() {
    const positions = [];

    // Mr. X
    let random = Math.floor((Math.random() * this.CONSTS.MRX_STARTING_POSITIONS.length) + 1);
    positions.push(this.CONSTS.MRX_STARTING_POSITIONS[random - 1]);
    
    // Players
    const startingPos = this.CONSTS.PLAYER_STARTING_POSITIONS;
    const len = startingPos.length - 1;
    let pos;
    for (let i=1; i<= this.CONSTS.MAX_PLAYERS; i++) {
      do {
        random = Math.floor(Math.random() * len);
        pos = startingPos[random];
      } 
      while (positions.indexOf(pos) >= 0);

      positions.push(pos);
    }

    return positions;
  },

  // move Mr. X and return his move
  moveMrX: function(positions, turn) {
    // generate the players' heat maps
    const heatMaps = []; // null for index 0
    for (let i = 1; i <= this.CONSTS.MAX_PLAYERS; i++) {
      heatMaps.push(this._generateDistanceArray(positions[i]));
    }

    // now compare the heatmaps and combine into one map by taking the lowest value for each
    var fHeatMap = [];
    for (let i = 0; i < 200; i++) {
      let thisNumber = 999;
      // in heatMaps array player 1 is at index 0
      for (let j = 0; j < this.CONSTS.MAX_PLAYERS; j++) {
        if (heatMaps[j][i] < thisNumber) {
          thisNumber = heatMaps[j][i];
        }
      }
      fHeatMap.push(thisNumber);
    }

    // ok so now we get into the AI
    // pull out only the locations that touch Mr. X from the heat map
    const mrxHeatMap = [];
    // this array will be [a,b] where a is the location and b is the heatmap value

    const nodes = this._getNode(positions[0]);
    for (let i = 0; i < nodes.length; i++) {
      const thismrxHeatMapNode = [nodes[i][0], fHeatMap[nodes[i][0]]];
      mrxHeatMap.push(thismrxHeatMapNode);
    }
    console.log('mrxHeatMap');
    console.log(mrxHeatMap);

    // now find the largest heatmap number
    let heatNumber = 0;
    for (let i = 0; i < mrxHeatMap.length; i++) {
      if (mrxHeatMap[i][1] > heatNumber) {
        heatNumber = mrxHeatMap[i][1];
      }
    }
    console.log('heatNumber');
    console.log(heatNumber);

    // now extract all moves that are the heatmap number, but now include a third element for transportation
    const finalHeatMap = [];
    for (let i = 0; i < mrxHeatMap.length; i++) {
      if (mrxHeatMap[i][1] == heatNumber) {
        var thisTransportationType = this._getBestTransportationType(positions[0], mrxHeatMap[i][0]);
        var thisElement = [mrxHeatMap[i][0], mrxHeatMap[i][1], thisTransportationType];
        finalHeatMap.push(thisElement);
      }
    }
    console.log('finalHeatMap');
    console.log(finalHeatMap);

    // weed out the remaining possibilities based on transportation type
    let highestTransportationNumber = 0;
    for (let i = 0; i < finalHeatMap.length; i++) {
      if (finalHeatMap[i][1] > highestTransportationNumber) {
        highestTransportationNumber = finalHeatMap[i][2];
      }
    }
    console.log(highestTransportationNumber);

    // now make an array of the final heatmap that will be randomized for movement
    const finalFinalHeatmap = [];
    for (let i = 0; i < finalHeatMap.length; i++) {
      if (finalHeatMap[i][2] == highestTransportationNumber) {
        finalFinalHeatmap.push([finalHeatMap[i][0], finalHeatMap[i][1], finalHeatMap[i][2]]);
      }
    }
    console.log('finalFinalHeatmap');
    console.log(finalFinalHeatmap);

    // randomly pick a destination from this list
    const random = Math.floor((Math.random() * finalFinalHeatmap.length));
    console.log(`random ${random}`);

//    var mrx_move = new MrXMoveObject(finalFinalHeatmap[random][0], GetTransportationTypeString(finalFinalHeatmap[random][2]), dead, fHeatMap);

    return {
      position: finalFinalHeatmap[random][0],
      transportation: finalFinalHeatmap[random][2],
      isVisible: false,
      dead: (heatNumber == 0) // nowhere to move
    };
  },

  // returns a boolean indicating if a player can move from startPostion to endPosition
  isMoveValid: function(startPosition, endPosition, transportation) {
    const startNode = this._getNode(startPosition);

    for (let j = 0; j < startNode.length; j++)
    {
      if (startNode[j][0] == endPosition && startNode[j][1] === transportation) {
        return true;
      }
    }
    return false;
  },

  // returns a boolean indicating if Mr X was caught
  isMrXCaught: function(positions) {
    for (let i = 1; i <= this.CONSTS.MAX_PLAYERS; i++) {
      if (positions[0] === positions[i]) {
        return true;
      }
    }
    return false;
  }
}