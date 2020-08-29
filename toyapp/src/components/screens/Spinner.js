import * as React from 'react';
import { Animated, Easing, Text, View, StyleSheet } from 'react-native';

export default class Spinner extends React.Component {
    constructor(props) {
        super(props)

        this.spinAnimation = new Animated.Value(0)

        this.spin = this.spinAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
    
    }

    componentDidMount() {
        Animated.loop(Animated.timing(this.spinAnimation, {
            toValue: 1,
            duration: 1400,
            easing: Easing.linear,
            useNativeDriver: true
        })).start()    
    }

    
    render() {
        return (
            <View style={styles.container}>
                <Animated.View style={[styles.spinner, { transform: [{ rotate: this.spin }]} ]}>
                    <Text>Hello</Text>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    spinner: {
        width: 60,
        height: 60,
        borderRadius: 70,
        borderColor: 'indigo',
        borderTopWidth: 5,
        borderRightWidth: 0,
        borderBottomWidth: 5,
        borderLeftWidth: 5,
        // alignItems: 'center',
        // justifyContent: 'center'
    }
});