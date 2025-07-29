import {Button, Dialog, Portal, Text, useTheme} from "react-native-paper";
import {ActivityIndicator, ScrollView, StyleSheet} from "react-native";
import React from "react";


function QuizFetchingDialog({isVisible}: {
    isVisible: boolean,
}) {

    return <Portal>
        <Dialog visible={isVisible}>
            <Dialog.Content style={{
                justifyContent: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8
            }}>
                <ActivityIndicator size="large"/>
                <Text>Fetching...</Text>
            </Dialog.Content>
        </Dialog>
    </Portal>;
}


export default QuizFetchingDialog;