import React from 'react';
import StyleSheet from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';

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

export default HomeScreen();

const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: Colors.lighter,
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
})