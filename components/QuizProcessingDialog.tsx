import {Button, Dialog, Portal, Text, useTheme} from "react-native-paper";
import {ActivityIndicator, ScrollView, StyleSheet} from "react-native";
import React from "react";
import {useFetchAndParseQuiz} from "@/utils/useFetchAndParseQuiz";

interface QuizProcessingDialogProps {
    isVisible: boolean,
    id: string,
    onDismiss: () => void
}

function QuizProcessingDialog({isVisible, id, onDismiss}: QuizProcessingDialogProps) {
    const {colors} = useTheme();
    const {
        error,
        status,
        refetch,
        data,
        failureCount,
        setIsEnabled,
        isFetching
    } = useFetchAndParseQuiz(id);

    if (!isVisible) {
        return null;
    }

    if (isFetching) {
        return <Portal>
            <Dialog visible>
                <Dialog.Content style={styles.processingContent}>
                    <ActivityIndicator size="large"/>
                    <Text>{status}</Text>
                </Dialog.Content>
            </Dialog>
        </Portal>;
    }

    if (error) {
        return <Portal>
            <Dialog visible>
                <Dialog.Content style={styles.processingContent}>
                    <ScrollView style={{flexDirection: 'column'}}>
                        <Text style={{color: colors.error}}>{error.name}</Text>
                        <Text style={{color: colors.error}}>{error.message}</Text>
                    </ScrollView>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        onPress={onDismiss}
                    >
                        Cancel
                    </Button>
                    <Button
                        onPress={() => refetch()}
                        mode="contained"
                        style={{paddingHorizontal: 8}}
                    >
                        Retry
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    }


    return <Portal>
        <Dialog visible>
            <Dialog.Content style={styles.processingContent}>
                <ActivityIndicator size="large"/>
                <Text>Processing...</Text>
            </Dialog.Content>
        </Dialog>
    </Portal>;
}

const styles = StyleSheet.create({
    processingContent: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
});
export default QuizProcessingDialog;