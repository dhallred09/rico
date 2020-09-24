import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, ListViewComponent } from 'react-native';
import { sqrt } from 'react-native-reanimated';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { rowString } from '../../actions/TicTacAI';

// Display a square: an outer black square with an inner circle
const Square = ({val}) => {
    switch (val) {
        case 1: return (<View style={styles.square}><View style={styles.redsq}></View></View>)
        case 2: return (<View style={styles.square}><View style={styles.bluesq}></View></View>)
        default:return (<View style={styles.square}><View style={styles.sq}></View></View>)
    }
}

// Display a column as vertical Squares.
const Column = ({col,win,next,onClick}) => {
    // Disable 'button' if there's a winner or column is full
    const disable = (win!=0) || col.filter(Boolean).length == col.length;
    return(
        <TouchableHighlight onPress={onClick}
                activeOpacity={0.5} underlayColor={next?"red":"blue"} 
                disabled={disable}>
            <View style={styles.C4column}>
                { col.map((v,i)=>{
                    return(<Square key={i} val={v}/>)
                })}
            </View>
        </TouchableHighlight>
    );
}

// Display the board, as consecutive columns
const Board = ({board,win,next,onClick}) => {
    return(
        <View style={styles.C4board}>
            {board.map((c,i) => {
                return(<Column key={i} col={c} win={win} next={next} onClick={()=>onClick(i)}/>)
            })}
        </View>
    )
}

// Calculate a winner from a game board. Return the value of the lastMove position if found.
// Otherwise return 0.
const calculateWinner = (game) => {
    if (!game.lastMove) return false; // no previous move, empty board
    const x = game.lastMove[0];
    const y = game.lastMove[1];
    const p = game.board[x][y]; // last play, red or blue
    const incs = [[0,1],[1,0],[1,-1],[1,1]]; // increments for vertical, horizontal, and 2 diagonals
    // for each increment, examine relative positions from [x,y] for same player
    for (inc of incs) {
        let cnt=1; // number of consecutive plays; include lastMove square
        // Loop going 'forward' by adding increment to [x,y],
        // stopping when 4 or more player disks found, go out of bounds, or a non-player location found.
		for(let di=x+inc[0], dj=y+inc[1]; 
                cnt<4 && di>=0 && dj>=0 && di<game.xsize && dj<game.ysize && game.board[di][dj]==p; 
                di=di+inc[0], dj=dj+inc[1], cnt++);
        if (cnt>=4) return p; // 4 or more in a row: winner
        // Loop going 'backward' this time by subtracting increment to [x,y],
        // using the same stopping conditions.
        for(let di=x-inc[0], dj=y-inc[1]; 
            cnt<4 && di>=0 && dj>=0 && di<game.xsize && dj<game.ysize && game.board[di][dj]==p; 
            di=di-inc[0], dj=dj-inc[1], cnt++);
        if (cnt>=4) return p; // 4 or more in a row: winner
    }
    return 0; // no winner found
}

// The Connect Four game.
const Connect4 = () => {
    const xSize = 7;
    const ySize = 6;
    const initGame = { // game structure
        xsize: xSize,
        ysize: ySize,
        board: Array(xSize).fill().map(e=>Array(ySize).fill(null)),
        lastMove: null  // [x,y] of last move
    };
    const [history, setHistory] = useState([initGame]); // game state history
    const [stepNumber, setStepNumber] = useState(0); // step in history
    const [redIsNext, setRedIsNext] = useState(true); // red/blue turn
    const winner = calculateWinner(history[stepNumber]);
    const player = redIsNext ? 1 : 2;
    const pname = player == 1 ? 'Red' : 'Blue';

    // Deep copy of game structure
    const gameCopy = (game) => {
        let newGame = {...game}; // shallow copy
        newGame.board = game.board.map(e=>e.slice()); // deep board copy
        if (newGame.lastMove) newGame.lastMove = [...game.lastMove];
        return newGame;
    }

    // Return size of given column - number of non-null entries
    const columnSize = (board,col) => {
        return board.board[col].filter(Boolean).length;
    }

    // handle a click on a column
    const clickHandler = (i) => {
        // Get a snapshot of history; Necessary if we have gone back in time of history
        const snapshot = history.slice(0,stepNumber+1);
        const currentBoard = gameCopy(snapshot[stepNumber]); // get a copy we can modify
        const yPosition = columnSize(currentBoard,i); // y value determined by height of column plays
        // return if win or column filled 
        if (winner || yPosition==ySize) return;
        currentBoard.board[i][yPosition] = player; // set new play on board
        currentBoard.lastMove = [i,yPosition]; // record the play
        setHistory([...snapshot,currentBoard]); // add new board to snapshot as new history
        setStepNumber(snapshot.length); // bump stepNumber
        setRedIsNext(!redIsNext); // next turn
    }

    // Go back/forward to another game board
    const jumpTo = (delta) => {
        if (stepNumber+delta<0 || stepNumber+delta>=history.length) return; // return if delta illegal
        setStepNumber(stepNumber+delta); // set new stepNumber
        setRedIsNext((stepNumber+delta)%2==0); // set new next player
    }
    
    // True if the board is completely full. Used to determine draw.
    const boardFull = (game) => {
        return game.board.every((_col,x)=>columnSize(game,x)==game.ysize);
    }

    return(
    	<View style={styles.C4container}>
            <Text style={{fontSize:30}}>Connect Four Game</Text>
            <Text style={{fontSize:20}}>Take turns clicking on a column to drop your marker.  First to get 4 in a row vertically, horizontally, or diagonally wins.</Text>
            <Board board={history[stepNumber].board} win={winner} next={redIsNext} onClick={clickHandler}/>
            <View style={{flexDirection: "row"}}>
                <Button title="< Undo" disabled={!stepNumber} onPress={()=>jumpTo(-1)}/>
                <Button title="Redo >" disabled={stepNumber>=(history.length-1)} onPress={()=>jumpTo(+1)}/>
                <Button title="New Game" onPress={()=>jumpTo(-stepNumber)}/>    
            </View>
            {/* Display winner/draw/turn text */}
            <View style={styles.C4TurnText}>
                <Text style={{fontSize: 20}}>{winner ? "Winner: " + (winner==1 ? "Red" : "Blue") 
                    : boardFull(history[stepNumber]) ? "Draw" 
                    : "Next Player: "+pname}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    C4container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    C4board: {
        // flex:1,
        marginTop: 40,
        flexDirection: "row",
    },
    C4column: {
        // flex:1,
        flexDirection: "column-reverse",
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    C4TurnText: {
        marginTop: 10,
        color: "black",
        fontSize: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    square: {
        width: 55,
        height: 55,
        backgroundColor: "black",
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    redsq: {
        borderWidth: 4,
        width: 55,
        height: 55,
        borderRadius: 55/2,
        backgroundColor: "red",
        color: "red",
       //fontSize: 30,
        //flex: 1,
    },
    bluesq: {
        borderWidth: 4,
        width: 55,
        height: 55,
        borderRadius: 55/2,
        backgroundColor: "blue",
        //color: "blue",
        //fontSize: 30,
        //color: "red",
        //flex: 1,
    },
    sq: {
        borderWidth: 4,
        width: 55,
        height: 55,
        borderRadius: 55/2,
        backgroundColor: "white",
        //flex: 1,
    },
});

export default Connect4;