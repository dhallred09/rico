// Get the contents of a particular board row as a string. 
export function rowString(i,board) {
    return (board[i][0] + board[i][1] + board[i][2]);
}

// Get the contents of a particular board column as a string.
export function colString(j,board) {
    return (board[0][j] + board[1][j] + board[2][j]);
}

// Get the contents of the "left" diagonal (top left to bottom right)
// as a string.
export function diagString1(board) {
    return (board[0][0] + board[1][1] + board[2][2]);
}

// Get the contents of the "right" diagonal (top right to bottom left)
// as a string.
export function diagString2(board) {
    return (board[2][0] + board[1][1] + board[0][2]);
}

// Return an array of all coords open for playing
function openPlays(board) {
    var plays = [];
    for(var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
            if (board[i][j]=='') plays.push([i,j]);
        }
    }
    return plays;
}

//Given a list of possible plays, pick one at random
function randomPlay(plays) {
    console.log("pick random play from: "+plays);
    var limit = plays.length;
    var rand = Math.floor(Math.random()*(limit-1))
    return plays[rand];
}

// Find an open play on a row and choose it
function openPlayRow(i,board) {
    for (var j=0; j<3; j++) {
        if (board[i][j]=='') return [i,j];
    }
    return '';
}

// Find an open play on a column and choose it
function openPlayCol(j,board) {
    for (var i=0; i<3; i++) {
        if (board[i][j]=='') return [i,j];
    }
    return '';
}

// Choose an open play on a given diagonal and choose it
function openPlayDiag(j,board) {
    if (j==1) {
        if (board[0][0]=='') return [0,0];
        if (board[1][1]=='') return [1,1];
        if (board[2][2]=='') return [2,2];
    }
    else {
        if (board[0][2]=='') return [0,2];
        if (board[1][1]=='') return [1,1];
        if (board[2][0]=='') return [2,0];
    }
    return '';
}

// Pick a winning move for a player if possible. Else return ''
function checkWinningMove(player,board) {
    if (rowString(0,board)==player+player) { return openPlayRow(0,board)}
    if (rowString(1,board)==player+player) { return openPlayRow(1,board)}
    if (rowString(2,board)==player+player) { return openPlayRow(2,board)}
    if (colString(0,board)==player+player) { return openPlayCol(0,board)}
    if (colString(1,board)==player+player) { return openPlayCol(1,board)}
    if (colString(2,board)==player+player) { return openPlayCol(2,board)}
    if (diagString1(board)==player+player) { return openPlayDiag(1,board)}
    if (diagString2(board)==player+player) { return openPlayDiag(2,board)}
    return '';
}

// Pick a play to block a player from winning. Else return ''
function checkBlockingMove(oplayer,board) {
    if (rowString(0,board)==oplayer+oplayer) { return openPlayRow(0,board)}
    if (rowString(1,board)==oplayer+oplayer) { return openPlayRow(1,board)}
    if (rowString(2,board)==oplayer+oplayer) { return openPlayRow(2,board)}
    if (colString(0,board)==oplayer+oplayer) { return openPlayCol(0,board)}
    if (colString(1,board)==oplayer+oplayer) { return openPlayCol(1,board)}
    if (colString(2,board)==oplayer+oplayer) { return openPlayCol(2,board)}
    if (diagString1(board)==oplayer+oplayer) { return openPlayDiag(1,board)}
    if (diagString2(board)==oplayer+oplayer) { return openPlayDiag(2,board)}
    return '';
}

//return the number of blank plays on the board
function boardPlays(board) {
    var n = 0;
    for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
            if (board[i][j]!='') n++;
        }
    }
    return n;
}

// // Compute what turn we are on.
// function turnCount(board) {
//     n = boardPlays(board);
//     return Math.floor(n/2)+1;
// }

// const corners = [[0,0],[0,2],[2,0],[2,2]]; // list of corner positions
// const sides = [[0,1],[1,0],[1,2],[2,1]]; // list of side positions
// const centers = [[1,1]];

function nullBoard() {
    return [ [,,],[,,],[,,]];
}

// Compare two boards for equality
function boardEquals(board1,board2) {
    for(var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
            if (board1[i][j] != board2[i][j]) return false;
        }
    }
    return true;
}

// Return a rotated board, rotated to the right 90 degrees
function rotateBoard(board) {
    var newbd = nullBoard();
    for(var i=0; i<3; i++) {
        for (var j1=0, j2=2; j1<3; j1++,j2--) {
            newbd[i][j1] = board[j2][i];
        }
    }
    return newbd;
}

// Return a "flipped" board along the "left" diagonal
function flipBoard(board) {
    var newbd = nullBoard();
    for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
            newbd[j][i] = board[i][j];
        }
    }
    return newbd;
}

// Test pattern against current board.
// A pattern is a board, that can be rotated to match.
// Returns 0 if no match. Otherwise it returns 1-4 for pattern match
// in the 0th-3rd rotation, or 5-8 if flipped pattern matches in rotations.
function boardPatternMatch(board,pattern) {
    // if pattern has different number of board plays, no match
    if (boardPlays(board) != boardPlays(pattern)) return 0;
    if (boardEquals(board,pattern)) return 1;
    // Rotate pattern 3 times and see if there's a match
    var p = pattern;
    for (var k=0; k<3; k++) {
        p = rotateBoard(p);
        if (boardEquals(board,p)) return k+2;
    }
    // now flip pattern and try again
    p = flipBoard(pattern);
    if (boardEquals(board,p)) return 5;
    // Rotate pattern 3 times and see if there's a match
    for (var k=0; k<3; k++) {
        p = rotateBoard(p);
        if (boardEquals(board,p)) return k+6;
    }
    return 0; // no match
}

// Given a board transformation index, n, so manipulate the pattern
function alignPattern(n,pattern) {
    console.log("align pattern: n="+n+" pattern: "+pattern);
    var n = n-1; // make 0-based n
    var p = pattern;
    if (n>3) {
        p = flipBoard(p);
        n = n-4;
    }
    // rotate board n times
    console.log("rotate pattern "+n+" times. pattern: "+p);
    for (var i=0; i<n; i++) {
        p = rotateBoard(p);
    }
    return p;
}

// return a list of coordinates for non-empty pattern locations
function patternPlays(pattern) {
    var plays = [];
    for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
            if (pattern[i][j] != '') plays.push([i,j]);
        }
    }
    return plays;
}

// Given a play pattern, rotate/flip as necessary, then select plays
function playPattern(n,pattern) {
    var p = alignPattern(n,pattern);
    console.log("aligned pattern n="+n+" new pattern: "+p);
    return patternPlays(p);
}

// // True if the given board element at e is empty.
// function openbd(board,e) {
//     return board[e[0]][e[1]] == '';
// }

// // True if player is found at board coordinates.
// function playerAt(player,board,i,j) {
//     return board[i][j] == player;
// }

// // Return a list of corners adjacent to a position (which should be a side)
// function adjacentCorners(i,j) {
//     if      (i==1) { return [[0,j],[2,j]]; }
//     else if (j==1) { return [[i,0],[i,2]]; }
//     else           { return [] };
// }

// // Return a position opposite to given position
// function opposite(i,j) {
//     // 0 => 2, 2 => 0
//     m = (i==0?2:(i==2?0:i));
//     n = (j==0?2:(j==2?0:j));
//     return [m,n];
// }

// // Given coordinates of a side position, return a list of adjacent corner
// // positions. The corners must be empty.
// function adjacentCornersToSide(board,i,j) {
//     // alert(JSON.stringify('adjacents: '+adjacentCorners(i,j)));
//     // alert(JSON.stringify("again: "+adjacentCorners(i,j).filter(e=>openbd(board,e)).map(e=>"["+e[0]+"]["+e[1]+"]")));
//     return adjacentCorners(i,j).filter(e=>openbd(board,e));
// }

// // Given a side position, choose an opposite side if empty.
// function oppositeSide(board,i,j) {
//     list = [];
//     list.push(opposite(i,j)); // make a list of positions. 
//     console.log(" opposite side list: "+JSON.stringify(list,null,2));
//     v = list.filter(e=>openbd(board,e));
//     console.log("opposite side filtered: "+JSON.stringify(v,null,2));
//     return v[0];
// }

// // Return plays in opposing sides to player on any side.
// function opposingSide(player,board) {
//     pp = sides.filter(e=>playerAt(player,board,e[0],e[1])).map(x=>oppositeSide(board,x[0],x[1]));
//     console.log("opposing side: "+JSON.stringify(pp,null,2));
//     return pp;
// }

// // Return plays in open corners adjacent to player on any side.
// function playsInAdjacentCornersToSide(player,board) {
//     pp = sides.filter(e=>playerAt(player,board,e[0],e[1])).map(elem => adjacentCornersToSide(board,elem[0],elem[1])).flat();
//     console.log("plays in corners: " + JSON.stringify(pp,null,2));
//     return pp;
// }

// // True if player is found in any corner
// function playerIsInTheCorner(player,board) {
//     return corners.some(c=>playerAt(player,board,c[0],c[1]));
// }

// // True if player is found on any side
// function playerIsOnTheSide(player,board) {
//     return sides.some(s=>playerAt(player,board,s[0],s[1]));
// }

// These board patterns come in pairs; one matches the current board state 
// (after rotating or flipping), and the 2nd indicates safe moves 
// (non-empty strings).
const xInCenter = [['','',''],['','x',''],['','','']];
const xCentPlay = [['o','','o'],['','',''],['o','','o']];  // only corners safe
const xInCorner = [['x','',''],['','',''],['','','']];
const xCornPlay = [['','',''],['','o',''],['','','']]; // only center safe
const _x_Side =     [['','x',''],['','',''],['','','']];
const _x_SidePlay = [['o','','o'],['','o',''],['','o','']];
const xxo______ =   [['x','',''],['x','',''],['o','','']];
const xxo______Play=[['','',''],['','o','o'],['','o','o']];
const _xox_____   = [['','x','o'],['x','',''],['','','']];
const _xox_____Play=[['','',''],['','o',''],['','','o']];
const _xo___x__   = [['','','x'],['x','',''],['o','','']];
const _xo___x__Play=[['','',''],['','o','o'],['','','o']];
const _xox___ox   = [['','x',''],['x','','o'],['o','','x']];
const _xox___oxPlay=[['o','',''],['','o',''],['','','']];
// const _xo_x_xo_   = [['','','x'],['x','x','o'],['o','','']]; // doesn't matter where o plays
// const _xo_x_xo_Play=[['o','o',''],['','',''],['','o','']];
const xxoo_x___   = [['x','o',''],['x','',''],['o','x','']];
const xxoo_x___Play=[['','',''],['','o','o'],['','','o']];
const _xo__x___   = [['','',''],['x','',''],['o','x','']];
const _xo__x___Play=[['','o',''],['','o','o'],['','','']];
const _xo__xxo_   = [['','','x'],['x','','o'],['o','x','']];
const _xo__xxo_Play=[['o','o',''],['','o',''],['','','']];
const _xo___xox   = [['','','x'],['x','','o'],['o','','x']];
const _xo___xoxPlay=[['o','o',''],['','o',''],['','','']];
const _xo_____x   = [['','',''],['x','',''],['o','','x']];
const _xo_____xPlay=[['','',''],['','o','o'],['','','']];
const _xo__x_ox   = [['','',''],['x','','o'],['o','x','x']];
const _xo__x_oxPlay=[['o','o',''],['','o',''],['','','']];
const xxo__x_o_   = [['x','',''],['x','','o'],['o','x','']];
const xxo__x_o_Play=[['','o',''],['','o',''],['','','o']];
const ox_x__xo_   = [['o','x','x'],['x','','o'],['','','']];
const ox_x__xo_Play=[['','',''],['','o',''],['o','o','']];
const _x_x___o_   = [['','x',''],['x','','o'],['','','']];
const _x_x___o_Play=[['o','',''],['','',''],['o','','o']];
const ox_x___ox   = [['o','x',''],['x','','o'],['','','x']];
const ox_x___oxPlay=[['','',''],['','o',''],['o','o','']];
const _x_x__oox   = [['','x','o'],['x','','o'],['','','x']];
const _x_x__ooxPlay=[['','',''],['','o',''],['','','']];
const _x_xo____   = [['','x',''],['x','o',''],['','','']];
const _x_xo____Play=[['o','','o'],['','',''],['o','','']];
const _x__o_x__   = [['','','x'],['x','o',''],['','','']];
const _x__o_x__Play=[['o','o',''],['','',''],['o','','']];
const _x_ooxx__   = [['','o','x'],['x','o',''],['','x','']];
const _x_ooxx__Play=[['','',''],['','',''],['o','','o']];
const o___x___x   = [['o','',''],['','x',''],['','','x']];
const o___x___xPlay=[['','','o'],['','',''],['o','','']];
const x__oox_x_   = [['x','o',''],['','o','x'],['','x','']];
const x__oox_x_Play=[['','',''],['','',''],['o','','o']];
const x___o___x   = [['x','',''],['','o',''],['','','x']];
const x___o___xPlay=[['','o',''],['o','','o'],['','o','']];

const oPatterns = [
    xInCenter, xInCorner, _x_Side,
    xxo______, _xox_____, _xo___x__, _xox___ox, /*_xo_x_xo_,*/ _xo__x___, xxoo_x___, _xo__xxo_, _xo___xox,
    _xo_____x, _xo__x_ox, xxo__x_o_, ox_x__xo_, _x_x___o_, ox_x___ox, _x_x__oox, 
    _x_xo____, _x__o_x__, _x_ooxx__, o___x___x, x__oox_x_, x___o___x, 
];

const oPatternPlays = [
    xCentPlay , xCornPlay , _x_SidePlay,
    xxo______Play, _xox_____Play, _xo___x__Play, _xox___oxPlay, /*_xo_x_xo_Play,*/ _xo__x___Play, xxoo_x___Play, _xo__xxo_Play, _xo___xoxPlay,
    _xo_____xPlay, _xo__x_oxPlay, xxo__x_o_Play, ox_x__xo_Play, _x_x___o_Play, ox_x___oxPlay, _x_x__ooxPlay, 
    _x_xo____Play, _x__o_x__Play, _x_ooxx__Play, o___x___xPlay, x__oox_x_Play, x___o___xPlay, 
];

function oPlayerAI(board) {
    var n=0; // board transformation index
    // Go through each possible pattern and if matching, select corresponding play
    for (var v=0; v<oPatterns.length; v++) {
        console.log("v: "+v+" Pattern: "+oPatterns[v]+" matches: "+boardPatternMatch(board,oPatterns[v])+", Plays: "+oPatternPlays[v]);
        if (n=boardPatternMatch(board,oPatterns[v])) return randomPlay(playPattern(n,oPatternPlays[v]));
    }
    console.log("choose random...");
    // // 1st play positions
    // if (boardEquals(board,xInCenter)) return randomPlay(corners);
    // if (boardPatternMatch(board,xInCorner)) return centers[0];
    // if (boardPatternMatch(board,_x_Side)) return randomPlay( [
    //         playsInAdjacentCornersToSide('x',board),
    //         centers,
    //         opposingSide('x',board)
    //     ].flat() );
    // // 2nd or higher positions
    // // x on the side:
    
    // if (n=boardPatternMatch(board,xxoSide)) return randomPlay(playPattern(n,xxoSidePlay));
    return ''; // means choose random free spot
}

function advancedAI(player,board,level) {
    if (player=='o') return oPlayerAI(board);
    return ''; // this causes a random play to be selected
}

// AI for Tic-Tac-Toe game.
// Args:
//  player: 'x' or 'o'
//  board: board game state, an array of 3 row arrays
//  level: AI option level, 1, 2, or 3 (hardest)
// Return: [i,j] coordinates for the AI's play
export function ticTacAI(player, board, level) {
    var oplayer = (player=='x' ? 'o' : 'x');
    if (level>1) {
        let play = checkWinningMove(player,board);
        if (play != '') return play;
        play = checkBlockingMove(oplayer,board);
        if (play != '') return play;
    }
    if (level>2) {
        let play = advancedAI(player,board,level);
        if (play != '') return play;
    }
    const plays = openPlays(board);
    return randomPlay(plays);
}