/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import TennisBall from './src/components/screens/TennisBall';
import Spinner from './src/components/screens/Spinner';

const myStack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.sectionContainer}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {/* <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}              */}
          <View style={styles.sectionContainer}>
            <Button 
              onPress={() => navigation.navigate('TicTacToe')}
              title="Play Tic-Tac-Toe"
              color="#841584"
              backgroundColor = '#34eb74'
              >
            </Button>
            <Button
              onPress={() => navigation.navigate('TennisBallDemo')}
              title="Tennis Ball Demo"
              color="#841584"
              backgroundColor = '#34eb74'
              >
            </Button>
            <Button 
              onPress={() => navigation.navigate('SpinnerDemo')}
              title="Spinner Demo"
              color="#841584"
              bdackgroundColor='#34eb74'
              >
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
class TicTacScreen extends React.Component {
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
    }
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

  rowString = (i) => {
    return (this.state.gameState[i][0] + this.state.gameState[i][1] + this.state.gameState[i][2]);
  }
  
  colString = (j) => {
    return (this.state.gameState[0][j] + this.state.gameState[1][j] + this.state.gameState[2][j]);
  }

  diagString1 = () => {
    return (this.state.gameState[0][0] + this.state.gameState[1][1] + this.state.gameState[2][2]);
  }
  
  diagString2 = () => {
    return (this.state.gameState[2][0] + this.state.gameState[1][1] + this.state.gameState[0][2]);
  }

  xWinner = () => {
    if (this.rowString(0) == "xxx" ||
        this.rowString(1) == "xxx" ||
        this.rowString(2) == "xxx" ||
        this.colString(0) == "xxx" ||
        this.colString(1) == "xxx" ||
        this.colString(2) == "xxx" ||
        this.diagString1() == "xxx" ||
        this.diagString2() == "xxx" ) return true;
    return false;
  }

  oWinner = () => {
    if (this.rowString(0) == "ooo" ||
        this.rowString(1) == "ooo" ||
        this.rowString(2) == "ooo" ||
        this.colString(0) == "ooo" ||
        this.colString(1) == "ooo" ||
        this.colString(2) == "ooo" ||
        this.diagString1() == "ooo" ||
        this.diagString2() == "ooo" ) return true;
    return false;
  }

  draw = () => {
    for (i=0; i<=2; i++) {
      for (j=0; j<=2; j++) {
        if (this.state.gameState[i][j] == "") return false;
      }
    }
    return true;
  }

  renderSquare = (row,col) => {
    var value = this.state.gameState[row][col];
    switch (value) {
      case "x": return (<Text style={styles.tileX}>  X</Text>);
      case "o": return (<Text style={styles.tileO}>  O</Text>);
      default:  return (<Text style={styles.tileX}></Text>);
    }
  }

  setSquare = (i,j) => {
    if (this.xWinner() || this.oWinner()) {console.log("winner"); return;}// if a winner: can't play
    let arr = this.state.gameState;
    if (arr[i][j] != "") return; // can't change a value already set
    arr[i][j] = this.state.currentPlayer;
    this.setState({gameState : arr});
    let nextPlayer = (this.state.currentPlayer == "x" ? "o" : "x");
    this.setState({currentPlayer: nextPlayer});
  }

  turnText = () => {
    if (this.xWinner()) return (<Text style={styles.TTTtext}>X Wins!</Text>);
    if (this.oWinner()) return (<Text style={styles.TTTtext}>O Wins!</Text>);
    if (this.draw()) return (<Text style={styles.TTTtext}>Draw!</Text>);
    switch(this.state.currentPlayer) {
      case "x": return (<Text style={styles.tileX2}>X <Text style={styles.TTTtext}>Turn</Text></Text>);
      case "o": return (<Text style={styles.tileO2}>O <Text style={styles.TTTtext}>Turn</Text></Text>);
    }
  }

  render(){
    return (
      <View style={styles.TTTcontainer}>
        <View style={{flexDirection: "row"}}>
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
        <View style={{flexDirection: "row"}}>
          <View style={styles.TTTtext}>
            
           {this.turnText()}
          </View>
        </View>
      </View>
    );
  }
  
}

export default class App extends React.Component {
  
  render() {  
    return (
      <NavigationContainer>
        <myStack.Navigator initialRouteName="Home">
          <myStack.Screen 
            name="Home"
            component={HomeScreen}
            options={{ title: 'Welcome'}}
          />
          <myStack.Screen name="TicTacToe" component={TicTacScreen} /> 
          <myStack.Screen name="TennisBallDemo" component={TennisBall} />
          <myStack.Screen name="SpinnerDemo" component={Spinner} />
        </myStack.Navigator>
      </NavigationContainer>
    );
  }
  
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
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
  }
});

