import React, { useState } from 'react';
import {Component, StyleSheet, View, Text, Button, 
  TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { Colors, } from 'react-native/Libraries/NewAppScreen';
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RadioForm from 'react-native-simple-radio-button';
import { ticTacAI, rowString, colString, diagString1, diagString2, 
         nullBoard, arrayCopy } from '../../actions/TicTacAI';
// import { HotKeys } from "react-hotkeys";

export default class TicTacScreen extends React.Component {
    constructor(props)
    {
      super(props);
      this.state={

        boardSize: 3, // size of tic-tac-toe board

        gameState : [
          ["","",""],
          ["","",""],
          ["","",""],
        ],
        currentPlayer : "x",
        optionVisible : false,  //Option screen
        oAIlevel: 0, // AI level for O (0 == human)
        xAIlevel: 0, // AI level for X (0 == human)
      }

      // this.keyMap = {
      //   NEWGAME: "n"
      // };

      // this.handlers = {
      //   NEWGAME: (e) => {this.resetGame;}
      // };

    }
  
    resetGame = (size) => {
      this.setState({
        gameState : nullBoard(size),
        currentPlayer : "x",
      });
    }
  
    changeBoardSize = (size) => {
      this.setState({boardSize:size});
      this.resetGame(size);
      console.log("change board: "+size+" board:"+this.gameState);
    }
    
    // Turn Options screen (a Modal) on (visible) or off (invisible).
    toggleModal = () => {
      const newV = !this.state.optionVisible;
      this.setState({ optionVisible: newV });
    };

    // screen size options
    sizeOptions = [
      {label: "3", value: 3},
      {label: "4", value: 4},
      {label: "5", value: 5},
      {label: "6", value: 6},
    ];

    // player AI options
    oOptions = [
      {label: "Human", value: 0 },
      {label: "AI easy", value: 1},
      {label: "AI medium", value: 2},
      {label: "AI hard", value: 3},
    ];

    
    // Detect if a given player has won by looking for rows, columns, or diagonals
    // filled with the payer's mark. Note, the actual board contents are lowercase.
    winner = (player) => {
      var board = this.state.gameState; // Note: shallow reference
      var size = this.state.boardSize;
      var v = player.repeat(board.length);
      // console.log("Win: v:"+v+" rowString(0):"+rowString(0,board));
      for (let i=0; i<size; i++) {
        if (rowString(i,board) == v) return true;
        if (colString(i,board) == v) return true;
      }
      if (diagString1(board) == v ||
          diagString2(board) == v ) return true;
      return false;
    }
  
    // Detect if the game is a draw - all squares filled.
    // It is assumed that winner detection has already been done.
    draw = () => {
      var board = this.state.gameState; // Note: shallow reference
      for (var i=0; i<board.length; i++) {
        for (var j=0; j<board.length; j++) {
          if (board[i][j] == "") return false;
        }
      }
      return true;
    }

    // Render the text of a square, x or o
    squareText = (value) => {
      var pad="";
      switch (value) {
        // Couldn't get centering to work, so I inject spaces before the X or O. :(
        case "x": return (<Text style={styles.tileX}>{pad+"X"}</Text>);
        case "o": return (<Text style={styles.tileO}>{pad+"O"}</Text>);
        default:  return (<Text style={styles.tileX}></Text>);
      }
    }
  
    // Place a new value in a board square.
    // The value to be placed is the currentPlayer (x or o).
    // Note: this function is also use by the AI move.
    setSquare = (i,j) => {
      // console.log("setSquare("+JSON.stringify(i,null,2)+","+JSON.stringify(j,null,2)+")");
      // Simply return if we can't actually add another value to the board.
      // For example, a human player can continue to click on squares after
      // the game is won, but it won't do anything.
      if (this.winner('x') || this.winner('o')) return; // if a winner: can't play
      let arr = arrayCopy(this.state.gameState);
      if (arr[i][j] != "") return; // can't change a value already set
      arr[i][j] = this.state.currentPlayer; // assign the new play to the board
      this.setState({gameState : arr});
      // Now switch players.
      let nextPlayer = (this.state.currentPlayer == "x" ? "o" : "x");
      this.setState({currentPlayer: nextPlayer});
    }

    getSquareWidth = () => {
      switch( this.state.boardSize ) {
        case(3): return 100;
        case(4): return 100;
        default: return 100 - ((this.state.boardSize - 4)*15);
      }
    }

    renderRow = (i,row) => {
      var size = row.length;
      var sqsize = this.getSquareWidth();
      // console.log("square width:"+sqsize);
      return (
        row.map((e,j) => {
          return (
            <TouchableWithoutFeedback  onPress={() => this.setSquare(i,j) } key={"row "+i+" col "+j}>
              <View style={[styles.TTTtile, { 
                  borderLeftWidth: (j==0 ? 0: 4), 
                  borderTopWidth: (i==0 ? 0 : 4), 
                  borderRightWidth: (j==size-1 ? 0 : 4), 
                  borderBottomWidth: (i==size-1 ? 0 : 4),
                  width: sqsize ,
                  height: sqsize ,
                } ]}>
                {this.squareText(e)}
              </View>
            </TouchableWithoutFeedback>
          );
          
        })
      );
    } 

    AImove = () => {
      // Check for AI player
      if (this.draw()) return null; // if board is full, no need for AI
      if (this.state.currentPlayer == 'x' && this.state.xAIlevel != 0 ||
          this.state.currentPlayer == 'o' && this.state.oAIlevel != 0) {
        // alert("AI player..." + this.state.oAIlevel + " " + this.state.currentPlayer);
        let level = (this.state.currentPlayer=='x' ? this.state.xAIlevel : this.state.oAIlevel);
        let play = ticTacAI(this.state.currentPlayer,this.state.gameState,level);
        // console.log("AI play: "+JSON.stringify(play,null,2));
        this.setSquare(play[0],play[1]);
      }
      return null;
    }
  
    // Display text on whose turn it is.
    // Displays winner/draw instead when needed.
    turnText = () => {
      if (this.winner('x')) return (<Text style={styles.TTTtext}>X Wins!</Text>);
      if (this.winner('o')) return (<Text style={styles.TTTtext}>O Wins!</Text>);
      if (this.draw()) return (<Text style={styles.TTTtext}>Draw!</Text>);
      switch(this.state.currentPlayer) {
        case "x": return (<Text style={styles.tileX2}>X <Text style={styles.TTTtext}>Turn </Text></Text>);
        case "o": return (<Text style={styles.tileO2}>O <Text style={styles.TTTtext}>Turn</Text></Text>);
      }
    }
  
    render(){
      return (
      // <HotKeys keyMap={this.keyMap} handlers={this.handlers} >
        <View style={styles.TTTcontainer}>
          {/* Render the board */}
          { this.state.gameState.map((row,idx) => {
            return (
              <View style={{flexDirection: "row"}} key={idx}>
                {this.renderRow(idx,row)}
              </View>
              );
          }) }
          

          {/* Render whose turn it is, or winner */}
          <View style={{flexDirection: "row"}}>
            <View style={styles.TTTtext}>
              {this.turnText()}
            </View>
          </View>

          {/* New Game button */}
          <TouchableWithoutFeedback  onPress={() => this.resetGame(this.state.boardSize) }>
              <View style={[styles.TTTtext]}>
                <Text style={{color:"green", fontSize:30, marginTop:20}}>New Game</Text>
              </View>
            </TouchableWithoutFeedback>

          < this.AImove />
          
          {/* Render Options screen as a Modal object */}
          <Modal 
                animationType = {"slide"}
                transparent={false}
                isVisible={this.state.optionVisible}>
            <View style={styles.modal}>
                <Text style={styles.optionText}>Tic-Tac-Toe Options</Text>
                <Text style={styles.optionText}>Board Size</Text>
                <RadioForm
                    radio_props={this.sizeOptions}
                    initial={this.state.boardSize - 3}
                    formHorizontal={true}
                    labelHorizontal={false}
                    buttonColor={'#3e4152'}
                    labelColor={'white'}
                    selectedLabelColor={'yellow'}
                    onPress={(value) => this.changeBoardSize(value)}
                    // onPress={(value) => alert("value: "+value)}
                />
                <View style={{flexDirection: "row", marginTop: 5}} >
                  <View>
                    <Text style={styles.optionText}>X Player</Text>
                    <RadioForm
                        radio_props={this.oOptions}
                        initial={this.state.xAIlevel}
                        buttonColor={'#3e4152'}
                        labelColor={'white'}
                        selectedLabelColor={'yellow'}
                        onPress={(value) => this.setState({xAIlevel:value})}
                    />
                  </View>
                  <View><Text>      </Text></View>
                  <View>
                    <Text style={styles.optionText}>O Player</Text>
                    <RadioForm
                        radio_props={this.oOptions}
                        initial={this.state.oAIlevel}
                        buttonColor={'#3e4152'}
                        labelColor={'white'}
                        selectedLabelColor={'yellow'}
                        onPress={(value) => this.setState({oAIlevel:value})}
                    />
                  </View>
                </View>
                <Text style={{fontSize: 50}}>   </Text>
                <Button title="Close Options" onPress={() => this.toggleModal()} />
            </View>
          </Modal>

          {/* Options button */}
          <TouchableOpacity onPress = {() => {this.toggleModal()}} >
            <Text style={styles.optionText}>Options</Text>
          </TouchableOpacity>
        </View>
      // </HotKeys>
        
      );
    }

    
  }
  
const styles = StyleSheet.create({
    TTTcontainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      TTTtext: {
        color: Colors.black,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 60
      },
      TTTtile: {
        borderWidth: 4,
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
      },
      tileX: {
        color: "red",
        fontSize: 65,
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
      },
      tileO: {
        color: "green",
        fontSize: 65,
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
      },
      tileX2: {
        color: "red",
        fontSize: 60,
      },
      tileO2: {
        color: "green",
        fontSize: 60,
      },
      modal: {
        flex: 1,
        marginTop: 100,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
      },
      optionText: {
          // color: '#3f2949',
          color: "blue",
          marginTop: 40,
          fontSize: 30,
          alignItems: "center",
          // justifyContent: "center",
      }
})