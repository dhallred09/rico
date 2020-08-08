/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
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

const Stack = createStackNavigator();

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
              title="Run Tic-Tac-Toe"
              color="#841584"
              backgroundColor = '#34eb74'
              >
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
function HomeScreen2() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}
function TicTacScreen() {
  return (
    <View style={styles.TTTcontainer}>
      <View style={{flexDirection: "row"}}>
        <View style={[styles.TTTtile, { borderLeftWidth: 0, borderTopWidth: 0} ]} />
        <View style={[styles.TTTtile, { borderTopWidth: 0 }]} />
        <View style={[styles.TTTtile, { borderTopWidth: 0, borderRightWidth: 0} ]} />
      </View>
    
      <View style={{flexDirection: "row"}}>
        <View style={[styles.TTTtile, { borderLeftWidth: 0 }]} />
        <View style={[styles.TTTtile,]} />
        <View style={[styles.TTTtile, { borderRightWidth: 0 }]} />
      </View>
    
      <View style={{flexDirection: "row"}}>
        <View style={[styles.TTTtile, { borderLeftWidth: 0, borderBottomWidth: 0} ]} />
        <View style={[styles.TTTtile, { borderBottomWidth: 0 }]} />
        <View style={[styles.TTTtile, { borderRightWidth: 0, borderBottomWidth: 0} ]} />
      </View>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home"
          component={HomeScreen}
          options={{ title: 'Welcome'}}
        />
        <Stack.Screen name="TicTacToe" component={TicTacScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
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
  TTTtile: {
    borderWidth: 10,
    width: 100,
    height: 100,
  }
});

export default App;
