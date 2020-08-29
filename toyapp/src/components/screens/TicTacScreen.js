import React, { useState } from 'react';
import {Component, StyleSheet, View, Text, Button, 
  TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { Colors, } from 'react-native/Libraries/NewAppScreen';
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RadioForm from 'react-native-simple-radio-button';
import { ticTacAI, rowString, colString, diagString1, diagString2 } from '../../actions/TicTacAI';
// import { HotKeys } from "react-hotkeys";

export default class TicTacScreen extends React.Component {
    constructor(props)
    {
      super(props);
      this.state={
        gameState : [
          ["","",""],
          ["","",""],
          ["","",""],
        ],
        currentPlayer : "x",
        optionVisible : false,
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
  
    resetGame = () => {
      this.setState({
        gameState : [
          ["","",""],
          ["","",""],
          ["","",""],
        ],
        currentPlayer : "x",
      });
    }
  
    
    // Turn Options screen (a Modal) on (visible) or off (invisible).
    toggleModal = () => {
      const newV = !this.state.optionVisible;
      this.setState({ optionVisible: newV });
    };

    oOptions = [
      {label: "Human", value: 0 },
      {label: "AI easy", value: 1},
      {label: "AI medium", value: 2},
      {label: "AI hard", value: 3},
    ];

    
    // Detect if X has won by looking for rows, columns, or diagonals
    // filled with X's. Note, the actual board contents are lowercase.
    xWinner = () => {
      var board = this.state.gameState;
      if (rowString(0,board) == "xxx" ||
          rowString(1,board) == "xxx" ||
          rowString(2,board) == "xxx" ||
          colString(0,board) == "xxx" ||
          colString(1,board) == "xxx" ||
          colString(2,board) == "xxx" ||
          diagString1(board) == "xxx" ||
          diagString2(board) == "xxx" ) return true;
      return false;
    }
  
    // Detect if O has won by looking for rows, columns, or diagonals
    // filled with O's. Note, the actual board contents are lowercase.
    oWinner = () => {
      var board = this.state.gameState;
      if (rowString(0,board) == "ooo" ||
          rowString(1,board) == "ooo" ||
          rowString(2,board) == "ooo" ||
          colString(0,board) == "ooo" ||
          colString(1,board) == "ooo" ||
          colString(2,board) == "ooo" ||
          diagString1(board) == "ooo" ||
          diagString2(board) == "ooo" ) return true;
      return false;
    }
  
    // Detect if the game is a draw - all squares filled.
    // It is assumed that winner detection has already been done.
    draw = () => {
      for (var i=0; i<=2; i++) {
        for (var j=0; j<=2; j++) {
          if (this.state.gameState[i][j] == "") return false;
        }
      }
      return true;
    }
  
    // How to display a board square on the screen
    renderSquare = (row,col) => {
      var value = this.state.gameState[row][col];
      switch (value) {
        // Couldn't get centering to work, so I inject spaces before the X or O. :(
        case "x": return (<Text style={styles.tileX}>  X</Text>);
        case "o": return (<Text style={styles.tileO}>  O</Text>);
        default:  return (<Text style={styles.tileX}></Text>);
      }
    }
  
    // Place a new value in a board square.
    // The value to be placed is the currentPlayer (x or o).
    setSquare = (i,j) => {
      // Simply return if we can't actually add another value to the board.
      // For example, a human player can continue to click on squares after
      // the game is won, but it won't do anything.
      if (this.xWinner() || this.oWinner()) return; // if a winner: can't play
      let arr = this.state.gameState;
      if (arr[i][j] != "") return; // can't change a value already set
      arr[i][j] = this.state.currentPlayer; // assign the new play to the board
      this.setState({gameState : arr});
      // Now switch players.
      let nextPlayer = (this.state.currentPlayer == "x" ? "o" : "x");
      this.setState({currentPlayer: nextPlayer});
      
    }

    AImove = () => {
      // Check for AI player
      if (this.draw()) return null; // if board is full, no need for AI
      if (this.state.currentPlayer == 'x' && this.state.xAIlevel != 0 ||
          this.state.currentPlayer == 'o' && this.state.oAIlevel != 0) {
        // alert("AI player..." + this.state.oAIlevel + " " + this.state.currentPlayer);
        let level = (this.state.currentPlayer=='x' ? this.state.xAIlevel : this.state.oAIlevel);
        let play = ticTacAI(this.state.currentPlayer,this.state.gameState,level);
        console.log("AI play: "+JSON.stringify(play,null,2));
        let i = play[0];
        let j = play[1];
        if (this.xWinner() || this.oWinner()) return null; // if a winner: can't play
        let arr = this.state.gameState;
        if (arr[i][j] != "") return null; // can't change a value already set
        arr[i][j] = this.state.currentPlayer; // assign the new play to the board
        this.setState({gameState : arr});
        // Now switch players.
        let nextPlayer = (this.state.currentPlayer == "x" ? "o" : "x");
        this.setState({currentPlayer: nextPlayer});
      }
      return null;
    }
  
    // Display text on whose turn it is.
    // Displays winner/draw instead when needed.
    turnText = () => {
      if (this.xWinner()) return (<Text style={styles.TTTtext}>X Wins!</Text>);
      if (this.oWinner()) return (<Text style={styles.TTTtext}>O Wins!</Text>);
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
          <View style={{flexDirection: "row"}}>
            {/* render row 0 */}
            <TouchableWithoutFeedback  onPress={() => this.setSquare(0,0) }>
              <View style={[styles.TTTtile, { borderLeftWidth: 0, borderTopWidth: 0} ]}>
                {this.renderSquare(0,0)}
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback  onPress={() => this.setSquare(0,1) }>
              <View style={[styles.TTTtile, { borderTopWidth: 0 }]}>
                {this.renderSquare(0,1)}
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback  onPress={() => this.setSquare(0,2) }>
              <View style={[styles.TTTtile, { borderTopWidth: 0, borderRightWidth: 0} ]}>
                {this.renderSquare(0,2)}
              </View>
            </TouchableWithoutFeedback>
          </View>
        
          <View style={{flexDirection: "row"}}>
            {/* render row 1 */}
            <TouchableWithoutFeedback  onPress={() => this.setSquare(1,0) }>
              <View style={[styles.TTTtile, { borderLeftWidth: 0 }]}>
                {this.renderSquare(1,0)}
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback  onPress={() => this.setSquare(1,1) }>
              <View style={[styles.TTTtile,]}>
                {this.renderSquare(1,1)}
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback  onPress={() => this.setSquare(1,2) }>
              <View style={[styles.TTTtile, { borderRightWidth: 0 }]}>
                {this.renderSquare(1,2)}
              </View>
            </TouchableWithoutFeedback>
          </View>
        
          <View style={{flexDirection: "row"}}>
            {/* render row 2 */}
            <TouchableWithoutFeedback  onPress={() => this.setSquare(2,0) }>
             <View style={[styles.TTTtile, { borderLeftWidth: 0, borderBottomWidth: 0} ]}>
                {this.renderSquare(2,0)}
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback  onPress={() => this.setSquare(2,1) }>
              <View style={[styles.TTTtile, { borderBottomWidth: 0 }]}>
                {this.renderSquare(2,1)}
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback  onPress={() => this.setSquare(2,2) }>
              <View style={[styles.TTTtile, { borderRightWidth: 0, borderBottomWidth: 0} ]}>
                {this.renderSquare(2,2)}
              </View>
            </TouchableWithoutFeedback>
            
          </View>

          {/* Render whose turn it is, or winner */}
          <View style={{flexDirection: "row"}}>
            <View style={styles.TTTtext}>
              {this.turnText()}
            </View>
          </View>

          {/* New Game button */}
          <TouchableWithoutFeedback  onPress={() => this.resetGame() }>
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
                <Text style={styles.optionText}>O Player</Text>
                <RadioForm
                    radio_props={this.oOptions}
                    initial={this.state.oAIlevel}
                    buttonColor={'#3e4152'}
                    labelColor={'white'}
                    selectedLabelColor={'yellow'}
                    onPress={(value) => this.setState({oAIlevel:value})}
                />
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