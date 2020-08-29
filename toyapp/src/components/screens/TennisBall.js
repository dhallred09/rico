import React, { Component } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default class TennisBall extends Component {
    constructor(props) {
        super(props);

        this.moveAnimation = new Animated.ValueXY({ x:10, y:450 })
    }

    moveBall = () => {
        Animated.spring(this.moveAnimation, {
            toValue: { x:250, y:10 },
            useNativeDriver: false,
        }).start()
    }
    render() {
        return(
            <View style={styles.container}>
                <View style={styles.container2}>
                    <Text style={styles.headtext}>Tennis Ball Animation</Text>
                </View>
                
                <Animated.View style={[styles.tennisBall, this.moveAnimation.getLayout()]}>
                    <TouchableWithoutFeedback style={styles.button} onPress={this.moveBall}>
                        <Text style={styles.buttonText}>Press</Text>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    container2: {
        // flex: 1,
        // backgroundColor: '#ecf0f1',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    tennisBall: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'greenyellow',
        borderRadius: 100,
        width: 100,
        height: 100,
    },
    button: {
        paddingTop: 24,
        paddingBottom: 24,
    },
    buttonText: {
        fontSize: 24,
        color: '#333',
    },
    headtext: {
        color: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24
      },
});