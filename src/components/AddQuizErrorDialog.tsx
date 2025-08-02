import React, {memo} from 'react';
import {Button, Dialog, Portal, Text, useTheme} from "react-native-paper";
import {ScrollView, StyleSheet} from "react-native";

interface  Props {
    onErrorDismiss: () => void
    error?: Error
    onErrorRefetch: () => void;
    isVisible: boolean;
}

const AddQuizErrorDialog = ({isVisible,onErrorRefetch, onErrorDismiss,error} : Props) => {
    const {colors} = useTheme();

    if(!error) {
        return null;
    }

    return <Portal>
        <Dialog visible={isVisible}>
            <Dialog.Content style={styles.processingContent}>
                <ScrollView style={{flexDirection: 'column'}}>
                    <Text style={{color: colors.error}}>{error.name}</Text>
                    <Text style={{color: colors.error}}>{error.message}</Text>
                </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
                <Button
                    onPress={onErrorDismiss}
                >
                    Cancel
                </Button>
                <Button
                    onPress={onErrorRefetch}
                    mode="contained"
                    style={{paddingHorizontal: 8}}
                >
                    Retry
                </Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
};

const styles = StyleSheet.create({
    processingContent: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
});

export default memo(AddQuizErrorDialog);