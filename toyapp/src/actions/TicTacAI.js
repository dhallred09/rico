import { unstable_enableLogBox, DrawerLayoutAndroidBase } from "react-native";

class IntelBoard {
    constructor(board) {
        var len = board.length;
        this.ibd = {
            size: board.length,
            // Structure:
            // { rows: [
            //  	{ elems: [ // 
            //			{ item: value,
            //			  diag: 0|1|2 }, // 0==not on diagonal; 1==on left diag; 2==right diag
            //			... ], // size number of elems
            //		  xocnt: [n,m] // n==number x's in row, m==number o's in row
            //		},
            //		... ], // size number of rows
            //	  cols: ... // same strcture as rows
            //	  diags: ... // same structure as rows, except only 2 diagonals
            //	  moves: num  // number of moves - total of x's and o's
			// }
            rows: Array(len).fill().map(a=>{return {elems: Array(len).fill().map(b=>{return {item: '', diag: 0}}),xocnt: [0,0]}}),
            cols: Array(len).fill().map(a=>{return {elems: Array(len).fill().map(b=>{return {item: '', diag: 0}}),xocnt: [0,0]}}),
            diags:Array(2).fill().map(a=>{return {elems: Array(len).fill().map(b=>{return{item: ''}}),xocnt: [0,0]}}),
            moves: 0, // number of moves on board
            area: len*len, // number of squares on board
           };
        // init diagonal designations
        for (let i=0; i<this.ibd.size; i++) {
            let j = this.ibd.size - 1 - i;
            this.ibd.rows[i].elems[i].diag = 1;
            this.ibd.cols[i].elems[i].diag = 1;
            this.ibd.rows[i].elems[j].diag = 2;
            this.ibd.cols[j].elems[i].diag = 2;
        }
        for (let i=0; i<board.length; i++) {
            for (let j=0; j<board.length; j++) {
                this.set(i,j,board[i][j]);
            }
        }
    }
    // return a matrix board
    board() {
        var bd = Array(this.ibd.size).fill().map(()=>Array(this.ibd.size).fill('')); // init board matrix
        for(let i=0; i<this.ibd.size; i++) {
            for(let j=0; j<this.ibd.size; j++) {
                bd[i][j] = this.val(i,j);
            }
        }
        return bd;
    }
    // dump board to console
    dump(msg) { console.log(msg+JSON.stringify(this.ibd)); }
    // return a copy
    copy() { return new IntelBoard(this.board()); }
    // size of the board
    size() { return this.ibd.size; }
    // Return the board value at the given coordinates
    val(i,j) { return this.ibd.rows[i].elems[j].item; }
    // True if coordinate is empty
    isEmpty(i,j) { return this.val(i,j)==''; }
    // Number of moves
    moveCount() { return this.ibd.moves; }
    // Board squares (area)
    area() { return this.ibd.area; }
    // Return an array of open (blank) coordinates
    openPlays() {
        var plays=[];
        this.ibd.rows.forEach((r,i)=>{r.elems.forEach((c,j)=>{if(this.isEmpty(i,j))plays.push([i,j])})});
        return plays;
    }
    // Set the value of a position
    set(i,j,v) {
        const old = this.ibd.rows[i].elems[j].item;
        if (old != v && (old == 'x' || old == 'o')) this.unset(i,j);
        this.ibd.rows[i].elems[j].item = v;
        this.ibd.cols[j].elems[i].item = v;
        if (v=='x') {
            this.ibd.rows[i].xocnt[0]++;
            this.ibd.cols[j].xocnt[0]++;
            this.ibd.moves++;
        }
        else if (v=='o') {
            this.ibd.rows[i].xocnt[1]++;
            this.ibd.cols[j].xocnt[1]++;
            this.ibd.moves++;
        }
        if (i==j) { // 0 diag
            this.ibd.diags[0].elems[j].item = v;
            if (v=='x') this.ibd.diags[0].xocnt[0]++;
            else if (v=='o') this.ibd.diags[0].xocnt[1]++;
        }
        else if (this.ibd.size-1-i==j) { // 1 diag
            this.ibd.diags[1].elems[j].item = v;
            if (v=='x') this.ibd.diags[1].xocnt[0]++;
            else if (v=='o') this.ibd.diags[1].xocnt[1]++;
        }
    }
    // unset a position - make it blank ('')
    unset(i,j) {
        const old = this.ibd.rows[i].elems[j].item;
        if (old == '') return;
        this.ibd.rows[i].elems[j].item = '';
        this.ibd.cols[j].elems[i].item = '';
        if (old=='x') {
            this.ibd.rows[i].xocnt[0]--;
            this.ibd.cols[j].xocnt[0]--;
            this.ibd.moves--;
        }
        else if (old=='o') {
            this.ibd.rows[i].xocnt[1]--;
            this.ibd.cols[j].xocnt[1]--;
            this.ibd.moves--;
        }
        if (i==j) { // 0 diag
            this.ibd.diags[0].elems[j].item = '';
            if (old=='x') this.ibd.diags[0].xocnt[0]--;
            else if (old=='o') this.ibd.diags[0].xocnt[1]--;
        }
        else if (this.ibd.size-1-i==j) { // 1 diag
            this.ibd.diags[1].elems[j].item = '';
            if (old=='x') this.ibd.diags[1].xocnt[0]--;
            else if (old=='o') this.ibd.diags[1].xocnt[1]--;
        }
    }
    // true if player (x or o) has won
    winner(player) {
        const p = (player=='x' ? 0 : 1); // player index
        for (let i=0; i<this.ibd.size; i++) {
            if (this.ibd.rows[i].xocnt[p]==this.ibd.size) return true;
            if (this.ibd.cols[i].xocnt[p]==this.ibd.size) return true;
        }
        if (this.ibd.diags[0].xocnt[p]==this.ibd.size) return true;
        if (this.ibd.diags[1].xocnt[p]==this.ibd.size) return true;
        return false;
    }
    // return one location empty in given row
    emptyInRow(i) {
        let plays = [];
        for (let j=0; j<this.ibd.size; j++) {
            if (this.ibd.rows[i].elems[j].item == '') plays.push(j);
        }
        if (plays.length == 1) return plays[0];
        if (plays.length == 0) {
            console.log("emptyInRow("+i+") found no empties!");
            this.dump("ibd");
            alert("Expected an empty square in row "+i+". Found none!");
            return null;
        }
        console.log("emptyInRow("+i+") found multiple empties: "+plays);
        this.dump("ibd");
        alert("Expected a single empty square in row "+i+". Found several! "+plays);
        return null;
    }
    // return one location empty in given column
    emptyInCol(i) {
        let plays = [];
        for (let j=0; j<this.ibd.size; j++) {
            if (this.ibd.cols[i].elems[j].item == '') plays.push(j);
        }
        if (plays.length == 1) return plays[0];
        if (plays.length == 0) {
            console.log("emptyInCol("+i+") found no empties!");
            this.dump("ibd");
            alert("Expected an empty square in column "+i+". Found none!");
            return null;
        }
        console.log("emptyInCol("+i+") found multiple empties: "+plays);
        this.dump("ibd");
        alert("Expected a single empty square in column "+i+". Found several! "+plays);
        return null;
    }
    // return one location empty in given diagonal
    emptyInDiag(i) {
        let plays = [];
        for (let j=0; j<this.ibd.size; j++) {
            if (this.ibd.diags[i].elems[j].item == '') plays.push(j);
        }
        if (plays.length == 1) return plays[0];
        if (plays.length == 0) {
            console.log("emptyInDiag("+i+") found no empties!");
            this.dump("ibd");
            alert("Expected an empty square in diag "+i+". Found none!");
            return null;
        }
        console.log("emptyInDiag("+i+") found multiple empties: "+plays);
        this.dump("ibd");
        alert("Expected a single empty square in diag "+i+". Found several! "+plays);
        return null;
    }
    // remove duplicates from an array
    arrayUnique(arr) {
        return arr.filter((item,index)=>arr.indexOf(item)===index);
    }
    // Convert a Coordinate to a position (0..size-1)
    positionFromCoord(i,j) {
        return i*this.ibd.size + j;
    }
    // Convert a Position (0..size-1) to Coordinates [i,j]
    coordFromPosition(p) {
        return [ Math.floor(p/this.ibd.size), p % this.ibd.size ];
    }
    // unique moves - remove redundant ones
    uniquePlays(plays) {
        if (plays.length == 1) return plays;
        const positions = plays.map(p=>this.positionFromCoord(p[0],p[1]));
        const upos = this.arrayUnique(positions);
        return upos.map(p => this.coordFromPosition(p));
    }
    // moves of pending wins of a player (next move will win)
    pendingWinner(player) {
        let plays = [];
        const p = (player=='x' ? 0 : 1); // player index
        const o = (player=='o' ? 0 : 1); // opponent index
        // Find a row/col/diag with all but one play (which is empty) and gather
        // an array of those plays
        const n = this.ibd.size - 1; // number plays one short of a win
        for (let i=0; i<this.ibd.size; i++) {
            if (this.ibd.rows[i].xocnt[p]==n &&
                this.ibd.rows[i].xocnt[o]==0) plays.push([i,this.emptyInRow(i)]);
            if (this.ibd.cols[i].xocnt[p]==n &&
                this.ibd.cols[i].xocnt[o]==0) plays.push([this.emptyInCol(i),i]);
        }
        if (this.ibd.diags[0].xocnt[p]==n &&
            this.ibd.diags[0].xocnt[o]==0) {
                let i = this.emptyInDiag(0); plays.push([i,i]);
            };
        if (this.ibd.diags[1].xocnt[p]==n &&
            this.ibd.diags[1].xocnt[o]==0) {
                let i = this.emptyInDiag(1); plays.push([i,this.ibd.size-1-i]);
            };
        return this.uniquePlays(plays);
    }
    // Find moves that will create a pending win - that is, rows/cols/diags that have
    // size-2 moves of player, with none of opponent, such that one more move there
    // creates a pending win. A pending threat is one move short of a pending win.
    // This returns a threat object, with those rows/cols/diags that are threats.
    pendingThreats(player) {
        const p = (player=='x' ? 0 : 1); // player index
        const o = (player=='o' ? 0 : 1); // opponent index
        let threats = {
            rows: [],
            cols: [],
            diags:[]
        };
        const n = this.ibd.size - 2; // number plays to making a threat
        for (let i=0; i<this.ibd.size; i++) { // search rows/cols
            if (this.ibd.rows[i].xocnt[p]==n &&
                this.ibd.rows[i].xocnt[o]==0) threats.rows.push(i);
            if (this.ibd.cols[i].xocnt[p]==n &&
                this.ibd.cols[i].xocnt[o]==0) threats.cols.push(i);
        }
        for (let i=0; i<2; i++) { // search diags
            if (this.ibd.diags[i].xocnt[p]==n &&
                this.ibd.diags[i].xocnt[o]==0) threats.diags.push(i);
        }
        return threats;
    }
    // Set a Trap - two or more ways to win, such that a single block is insufficient.
    // There may be several traps that can be set, collect all
    setTrap(player) {
        let plays = []; // gather plays that set a trap
        const p = (player=='x' ? 0 : 1); // player index
        const o = (player=='o' ? 0 : 1); // opponent index
        // We need to find rows/cols/diags that have size-2 plays of player with no opponent.
        // Thus all they need is one more move to create a threat
        const threats = this.pendingThreats(player);
        // check intersection of rows vs cols/diags
        for (let i of threats.rows) {
            for (let j of threats.cols) {
                if (this.isEmpty(i,j)) plays.push([i,j]);
            }
            for (let j of threats.diags) {
                const k = (j==0 ? i : this.ibd.size-1-i);
                if (this.isEmpty(i,k)) plays.push([i,k]);
            }
        }
        // check intersection of cols vs diags
        for (let i of threats.cols) {
            for (let j of threats.diags) {
                const k = (j==0 ? i : this.ibd.size-1-i);
                if (this.isEmpty(i,k)) plays.push([i,k]);
            }
        }
        // if (player=='x' & this.ibd.moves==8) {
        //     // console.log("threats: "+JSON.stringify(threats,null,2));
        //     // console.log("set trap: "+plays);
        // }
        return this.uniquePlays(plays);
    }
    // True if player can't win. False if player still has opportunities to win.
    // (Sorry for the double negative here.)
    // If the opponent has a mark on a line, then the player can't win there.
    cantWin(player) {
        const o = (player=='o' ? 0 : 1); // opponent index
        for (let i=0; i<this.ibd.size; i++) { // check rows/cols for opponent
            if (this.ibd.rows[i].xocnt[o]==0) return false;
        	if (this.ibd.cols[i].xocnt[o]==0) return false;
        }
		for (let i=0; i<2; i++) { // check diags for opponent
            if (this.ibd.diags[i].xocnt[o]==0) return false;
        }
        // couldn't find any open lines - can't win.
        return true;
    }
}

// Get the contents of a particular board row as a string. 
export function rowString(i,board) {
    let v = "";
    for (let j=0; j<board.length; j++) v += board[i][j];
    return v;
}

// Get the contents of a particular board column as a string.
export function colString(j,board) {
    let v = "";
    for (let i=0; i<board.length; i++) v += board[i][j];
    return v;
}

// Get the contents of the "left" diagonal (top left to bottom right)
// as a string.
export function diagString1(board) {
    let v = "";
    for (let i=0; i<board.length; i++) v = v + board[i][i];
    return v;
}

// Get the contents of the "right" diagonal (top right to bottom left)
// as a string.
export function diagString2(board) {
    let v = "";
    for (let j=board.length-1, i=0; i<board.length; j--,i++) v = v + board[i][j];
    return v;
}

// Return an array of all coords open for playing
function openPlays(board,v='') {
    // console.log("openPlays( "+board+" , "+v);
    var plays = [];
    for(var i=0; i<board.length; i++) {
        for (var j=0; j<board.length; j++) {
            if (board[i][j]==v) plays.push([i,j]);
        }
    }
    return plays;
}

//Given a list of possible plays, pick one at random
function randomPlay(plays) {
    // console.log("pick random play from: "+JSON.stringify(plays,null,2));
    // console.log("pick random play from: "+plays);
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

// return an empty board
export function nullBoard(size) {
    // console.log("nullBoard("+size+")");
    return Array(size).fill().map(()=>Array(size).fill(''));
}

// Copy a 2-dimensional array
export function arrayCopy(ary) {
    return ary.map(a => a.slice());
}

function playWins(play,board) {
    var w = board[play[0]][play[1]].repeat(board.length);
    // console.log("playWins("+play+","+board+")"+" w:"+w);
    if (rowString(play[0],board) == w) return true;
    if (colString(play[1],board) == w) return true;
    if (diagString1(board) == w) return true;
    if (diagString2(board) == w) return true;
    return false;
}

// Given a set of plays, return the best score for the board.
// Assumption: already checked for immediate win for player or opponent.
function bestScoreOfPlays(plays,player,oplayer,ibd,depth) {
    if (plays.length==0) return 0; // no plays? neutral score
    var bestScore = -2; // keep best score on possible moves; -2 = worst
    for (const play of plays) {
        // In a new board, place a mark in the open play
        let newIbd = ibd.copy();
        newIbd.set(play[0],play[1],player);
        // Now let the opponent play; compute the score
        let score = - boardScore(oplayer,newIbd,depth-1); // compute a score
        // console.log(newIbd.moveCount()+" player "+player+" score: "+score+" for play: "+play);
        // newIbd.dump('after score');
        if (score==1) return 1; // prune tree: return first win
        // console.log(n+" "+player+" score: "+score+" for play "+play+" on board "+newbd);
        if (score > bestScore) bestScore = score; // get the best score
    }
    if (bestScore >= 0) return bestScore;
    else return -1; // No wins or draw scores, we must have lost
}

// Return player's best score for best move on board.
// Assumption: We are given a new board right after opponent moved
// score 1 =  this board state wins; 0 = draw; -1 = loss.
function boardScore(player,ibd,depth) {
    // if (ibd.winner(player)) return 1; // we won
    if (depth<0) return 0; // exceed max search; don't take any more time
    if (ibd.moveCount() == ibd.area()) return 0;  // board full
    // console.log(n+" boardScore("+player+","+board+") plays:"+plays);
    // If a winning move is available, we can win
    if (ibd.pendingWinner(player).length > 0) return 1; // player can win
    // If opponent can win, get score of attempt to block
    const oplayer = (player=='x' ? 'o' : 'x'); // opponent
    var plays = ibd.pendingWinner(oplayer);
    if (plays.length > 0) return bestScoreOfPlays(plays,player,oplayer,ibd,depth);
    // Try setting a trap
    plays = ibd.setTrap(player);
    // if there is a trap play, we trust it will truly be a win; no need to score it
    if (plays.length > 0) return 1; //bestScoreOfPlays(plays,player,oplayer,ibd,depth);
    // Check if opponent can set a trap; if so, try to block
    plays = ibd.setTrap(oplayer);
    if (plays.length > 0) return bestScoreOfPlays(plays,player,oplayer,ibd,depth);
    // If can't win - all lines are blocked - then return 0 (draw score).
    // technically, opponent could still pursue a win. but not likely it couldn't be blocked.
    if (ibd.moveCount()>ibd.size()*2 && ibd.cantWin(player)) return 0;
    // Try each open play and get a score for it.
    plays = ibd.openPlays();
    return bestScoreOfPlays(plays,player,oplayer,ibd,depth);
}

// This AI function returns the best move based on given board position.
// It is assumed that an immediate win by player or opponent has already been checked.
function getMoveByScore(player,board) {
    const oplayer = (player=='x' ? 'o' : 'x'); // the opponent
    var ibd = new IntelBoard(board); // use an 'inteligent' board
    const moves = ibd.moveCount(); // how many moves so far
    // ibd.dump("Top dump at "+moves+" ");
    var plays = ibd.openPlays(); // list of oopen (blank) plays
    // console.log("plays: "+plays);
    if (plays==[]) return ''; // no plays; this should never happen!
    const size = ibd.size(); // size of the board
    // If we're given a blank board (1st turn) just play randomly.
    if (moves == 0) return randomPlay(plays);
    // Try setting a trap
    let traps = ibd.setTrap(player);
    console.log("trap: "+JSON.stringify(traps,null,2));
    if (traps.length > 0) return randomPlay(traps);
    // Check if opponent can set a trap; if so, try to block
    traps = ibd.setTrap(oplayer);
    if (traps.length > 0) return randomPlay(traps);
    // For bigger boards, for first few turns, just play randomly.
    if (size > 3 && moves <= (size-1)*2) return randomPlay(plays);
    // if we can't win (all lines are blocked) just play randomly.
    // Technically, opponent could still have open lines to win, but most lijely they will be blocked.
    if (moves>size*2 && ibd.cantWin(player)) return randomPlay(plays);
    // Try each open play, compute a score. Limit search with depth constraint.
    const depth = (size==3 ? 9 : (size==4 ? size+2 : size+1)); // max depth of search, to constrain time
    var scoreBoard = arrayCopy(board); // keep a score for open positions
    for (const play of plays) {
        // In a new board, place a mark in the open play
        let newIbd = ibd.copy(); // new i-board (copy)
        newIbd.set(play[0],play[1],player); //set a mark
        // newIbd.dump("newIbd with play ["+play[0]+","+play[1]+"] ibd:");
        // Now give the opponent a turn; Get a score. We negate his score because
        // a win for him (1) will be a loss for us (-1), and vice-versa.
        const t0 = performance.now();
        let score = - boardScore(oplayer,newIbd,depth); // compute a score for new board
        const t1 = performance.now();
        console.log(player+" player at "+moves+" moves plays "+play+" with score "+score+" ("+(t1-t0)+" ms)")
        // console.log(moves+" "+player+" score: "+score+" for play "+play);
        // if score is 1 (a win) then go with it now; don't wait and find others
        if (score==1) return play; // if win, prune and go with that move
        scoreBoard[play[0]][play[1]] = score; // save the score
    }
    console.log('Top scoreboard: moves: '+moves+" scores: "+JSON.stringify(scoreBoard,null,2));
    // No need to test for '1' score since we take an early exit above
    // plays = openPlays(scoreBoard,1);
    // console.log("1 plays: "+plays+"  size:"+plays.length);
    // if (plays.length > 0) return randomPlay(plays); 
    plays = openPlays(scoreBoard,0);
    // console.log("0 plays: "+plays);
    if (plays.length > 0) return randomPlay(plays);
    plays = openPlays(scoreBoard,-1);
    if (plays.length > 0) return randomPlay(plays);
    return ''; // this should never happen!
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
    var p = arrayCopy(pattern);
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
    var p = arrayCopy(pattern);
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

function advancedAI(player,board) {
    if (player=='o' && board.length == 3) return oPlayerAI(board);
    return getMoveByScore(player,board);
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
        let play = advancedAI(player,board);
        if (play != '') return play;
    }
    // If none of the harder AI's came up with a better move,
    // pick a random one from all moves available.
    return randomPlay(openPlays(board));
}