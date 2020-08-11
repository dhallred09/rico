import * as React from 'react';
import { Animated, Easing, Text, View, StyleSheet } from 'react-native';

export default class Spinner extends React.Component {
    constructor(props) {
        super(props)

        this.spinAnimation = new Animated.Value(0)
    }

    componentDidMount() {
        Animated.loop(Animated.timing(this.spinAnimation, {
            toValue: 1,
            duration: 1400,
            easing: Easing.linear,
            useNativeDriver: true
        })).start()

        this.spin = this.spinAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
    }

    render() {
        return (
            <View style={StyleSheet.container}>
                <Animated.View style={[styles.spinner, { transform: [{ rotate: this.spin }]} ]} />
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
        width: 40,
        height: 40,
        borderRadius: 50,
        borderColor: 'indigo',
        borderTopWidth: 4,
        borderRightWidth: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
    }
});