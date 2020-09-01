// Get the contents of a particular board row as a string. 
export function rowString(i,board) {
    let v = "";
    for (let j=0; j<board.length; j++) {
        v += board[i][j];
    }
    console.log(" rowString: i:"+i+" v:"+v);
    return v;
}

// Get the contents of a particular board column as a string.
export function colString(j,board) {
    let v = "";
    for (let i=0; i<board.length; i++) {
        v += board[i][j];
    }
    return v;
}

// Get the contents of the "left" diagonal (top left to bottom right)
// as a string.
export function diagString1(board) {
    let v = "";
    for (let i=0; i<board.length; i++) {v = v + board[i][i];}
    return v;
}

// Get the contents of the "right" diagonal (top right to bottom left)
// as a string.
export function diagString2(board) {
    let v = "";
    for (let j=board.length-1, i=0; i<board.length; j--,i++) {v = v + board[i][j];}
    return v;
}

// Return an array of all coords open for playing
function openPlays(board) {
    var plays = [];
    for(var i=0; i<board.length; i++) {
        for (var j=0; j<board.length; j++) {
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
    for (var j=0; j<board.length; j++) {
        if (board[i][j]=='') return [i,j];
    }
    return '';
}

// Find an open play on a column and choose it
function openPlayCol(j,board) {
    for (var i=0; i<board.length; i++) {
        if (board[i][j]=='') return [i,j];
    }
    return '';
}

// Choose an open play on a given diagonal and choose it
function openPlayDiag(n,board) {
    if (n==1) {
        for (let i=0; i<board.length; i++) {if (board[i][i]=='') return [i,i];}
    }
    else {
        for (let j=board.length-1,i=0; i<board.length; j--,i++) {if (board[i][j]=='') return [i,j];}
    }
    return '';
}

// Pick a winning move for a player if possible. Else return ''
function checkWinningMove(player,board) {
    let pat = player.repeat(board.length-1);
    for (let i=0; i<board.length; i++) {
        if (rowString(i,board) == pat) { return openPlayRow(i,board);}
        if (colString(i,board) == pat) { return openPlayCol(i,board);}
    }
    if (diagString1(board)==pat) { return openPlayDiag(1,board)}
    if (diagString2(board)==pat) { return openPlayDiag(2,board)}
    return '';
}

//return the number of non-blank plays on the board
function boardPlays(board) {
    var n = 0;
    for (var i=0; i<board.length; i++) {
        for (var j=0; j<board.length; j++) {
            if (board[i][j]!='') n++;
        }
    }
    return n;
}

export function nullBoard(size) {
    console.log("nullBoard("+size+")");
    return Array(size).fill().map(()=>Array(size).fill(''));
}

// Compare two boards for equality
function boardEquals(board1,board2) {
    for(var i=0; i<board.length; i++) {
        for (var j=0; j<board.length; j++) {
            if (board1[i][j] != board2[i][j]) return false;
        }
    }
    return true;
}

// Return a rotated board, rotated to the right 90 degrees
function rotateBoard(board) {
    var newbd = nullBoard(board.length);
    for(var i=0; i<3; i++) {
        for (var j1=0, j2=2; j1<3; j1++,j2--) {
            newbd[i][j1] = board[j2][i];
        }
    }
    return newbd;
}

// Return a "flipped" board along the "left" diagonal
function flipBoard(board) {
    var newbd = nullBoard(board.length);
    for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
            newbd[j][i] = board[i][j];
        }
    }
    return newbd;
}

// Test pattern against current board.
// board: the current board position
// pattern: a board, that can be rotated to match the current board.
// Returns 0 if no match. Otherwise it returns 1-4 for pattern match
// in the 0th-3rd rotation, or 5-8 if flipped pattern matches in rotations.
function boardPatternMatch(board,pattern) {
    // if pattern has different number of board plays, no match
    if (boardPlays(board) != boardPlays(pattern)) return 0;
    if (boardEquals(board,pattern)) return 1; // board matches pattern w/o rotation/flipping
    // Rotate pattern 3 times and see if there's a match
    var p = pattern;
    for (var k=0; k<3; k++) {
        p = rotateBoard(p);
        if (boardEquals(board,p)) return k+2; // return value indicates how many rotations
    }
    // No match yet; now flip pattern and try again
    p = flipBoard(pattern);
    if (boardEquals(board,p)) return 5;
    // Rotate pattern 3 times and see if there's a match
    for (var k=0; k<3; k++) {
        p = rotateBoard(p);
        if (boardEquals(board,p)) return k+6;
    }
    return 0; // no match
}

// Given a board transformation index, n, manipulate the pattern accordingly
function alignPattern(n,pattern) {
    console.log("align pattern: n="+n+" pattern: "+pattern);
    var n = n-1; // make 0-based n
    var p = pattern;
    if (n>3) { // pattern needs to be flipped
        p = flipBoard(p);
        n = n-4; // remove the 'offset' indicating flipping
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
// n: the board transform index - how to rotate/flip the pattern to
//    match the current board
// pattern: positions in the board for good moves
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

// These board patterns come in pairs; one matches the current board state 
// (after rotating or flipping), and the 2nd indicates safe moves (plays) 
// (non-empty strings: by convention, I use an 'o' to indicate the better
// plays).
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
    xxo______, _xox_____, _xo___x__, _xox___ox, _xo__x___, xxoo_x___, _xo__xxo_, _xo___xox,
    _xo_____x, _xo__x_ox, xxo__x_o_, ox_x__xo_, _x_x___o_, ox_x___ox, _x_x__oox, 
    _x_xo____, _x__o_x__, _x_ooxx__, o___x___x, x__oox_x_, x___o___x, 
];

const oPatternPlays = [
    xCentPlay , xCornPlay , _x_SidePlay,
    xxo______Play, _xox_____Play, _xo___x__Play, _xox___oxPlay, _xo__x___Play, xxoo_x___Play, _xo__xxo_Play, _xo___xoxPlay,
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
        play = checkWinningMove(oplayer,board);
        if (play != '') return play;
    }
    if (level>2) {
        let play = advancedAI(player,board,level);
        if (play != '') return play;
    }
    // If none of the harder AI's came up with a better move,
    // pick a random one from all moves available.
    return randomPlay(openPlays(board));
}