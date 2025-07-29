import React, {useEffect} from 'react';
import {Dialog, Portal, ProgressBar, Text} from "react-native-paper";
import {StyleSheet} from 'react-native';

interface Props {
    isVisible: boolean;
    progress: number;
}

const AddQuizProcessingDialog =
    ({
         isVisible,
         progress,
     }: Props) => {
    // Validate progress value
    const normalizedProgress = Math.min(1, Math.max(0, progress));

    return (
        <Portal>
            <Dialog
                visible={isVisible}
                dismissable={false}
            >
                <Dialog.Content style={styles.content}>
                    <Text variant="bodyLarge" style={styles.text}>
                        Processing...
                    </Text>
                    <ProgressBar
                        progress={normalizedProgress}
                        style={styles.progressBar}
                    />
                    <Text variant="bodySmall" style={styles.percentageText}>
                        {Math.round(normalizedProgress * 100)}%
                    </Text>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    content: {
        justifyContent: 'flex-start',
        gap: 16,
        paddingVertical: 20,
    },
    text: {
        marginBottom: 8,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
    },
    percentageText: {
        alignSelf: 'flex-end',
        marginTop: -12,
    },
});

export default AddQuizProcessingDialog;