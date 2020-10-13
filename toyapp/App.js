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

import { Colors, } from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TicTacScreen from './src/components/screens/TicTacScreen';
import Connect4 from './src/components/screens/Connect4';
import FingerTouch from './src/components/screens/FingerTouch';
// import Transformations3D from './src/components/screens/Transformation3D';
// import Transformations3DSVG from './src/components/screens/Transformation3DSVG';
// import Kong from './src/components/screens/KongGame'
import TennisBall from './src/components/screens/TennisBall';
import Spinner from './src/components/screens/Spinner';

const myStack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.sectionContainer}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
          <View style={styles.sectionContainer}>
            { menu.slice(1,menu.length).map((item,i) => {
                return (<Button key={i}
                  onPress={() => navigation.navigate(item.screen)}
                  title={item.title}
                  color="#841584"
                  backgroundColor = '#34eb74'
                  >
                </Button>)
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// list of menu items with the screen name, title, and component.
// Note: this should be declared AFTER all components are known, including HomeScreen.
const menu = [];
menu.push({screen: 'Home', title: 'Welcome', comp: HomeScreen});
menu.push({screen: 'TicTacToe', title: 'Play Tic-Tac-Toe', comp: TicTacScreen});
menu.push({screen: 'ConnectFour', title: 'Play Connect Four', comp: Connect4});
menu.push({screen: 'MoveFingers', title: 'Move Fingers Demo', comp: FingerTouch});
// menu.push({screen: 'Transformations', title: '3D Transform Demo', comp: Transformations3D});
// menu.push({screen: 'TransformationsSVG', title: '3D SVG Transform Demo', comp: Transformations3DSVG});
// menu.push({screen: 'KongDemo', title: 'Tennis Ball Demo', comp: Kong});
menu.push({screen: 'TennisBallDemo', title: 'Tennis Ball Demo', comp: TennisBall});
menu.push({screen: 'SpinnerDemo', title: 'Spinner Demo', comp: Spinner});

export default class App extends React.Component {
  
  render() {  
    return (
      <NavigationContainer>
        <myStack.Navigator initialRouteName="Home">
          {menu.map((item,i) => {
            const title=item.title;
            return(
              <myStack.Screen key={i} name={item.screen} component={item.comp} options={{title}}/>
            )
          })}
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
  
});

