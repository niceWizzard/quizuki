import React from 'react';
import {View} from "react-native";
import {Button, Text} from "react-native-paper";
import {router} from "expo-router";

const IndexScreen = () => {
    return (
        <View style={{flex: 1}}>
            <Text>Hello World</Text>
            <Button
                onPress={() => router.navigate('/test')}
            >
                Navigate
            </Button>
        </View>
    );
};

export default IndexScreen;