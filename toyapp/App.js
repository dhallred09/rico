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
  
});

