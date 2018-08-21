import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Alert,
    Platform
} from 'react-native';

module.exports  = class extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.logo} source={require('../images/brand-medium.png')}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        width: 125,
        height:24,
        resizeMode:"contain"
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
