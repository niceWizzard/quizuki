import React from 'react';
import {Dialog, Portal, Text} from "react-native-paper";
import {ActivityIndicator} from "react-native";
import {Quiz} from "@/types";

interface Props {
    isVisible: boolean,
    quizData?: Quiz
}

const AddQuizProcessingDialog = ({isVisible, quizData}: Props) => {
    if(!quizData){
        return null;
    }
    return <Portal>
        <Dialog visible={isVisible}>
            <Dialog.Content style={{
                justifyContent: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8
            }}>
                <ActivityIndicator size="large"/>
                <Text>Processing... {quizData.name}</Text>
            </Dialog.Content>
        </Dialog>
    </Portal>;
};

export default AddQuizProcessingDialog;