import {StyleSheet} from "react-native";
import {FAB} from "react-native-paper";
import React, {useState} from "react";
import QuizUrlInputDialog from "@/components/QuizUrlInputDialog";
import QuizProcessingDialog from "@/components/QuizProcessingDialog";



enum DialogState {
    FormShown,
    Processing,
    Hidden,
}

const AddQuizDialog = () => {
    const [dialogState, setDialogState] = useState(DialogState.Hidden);
    const [id, setId] = useState('')

    const handleFormSubmit = (id: string) => {
        setId(id);
        setDialogState(DialogState.Processing);
    };

    const hideDialog = () => {
        setDialogState(DialogState.Hidden)
    }

    return <>
        <FAB
            icon="plus"
            style={styles.fab}
            disabled={dialogState !== DialogState.Hidden}
            onPress={() => setDialogState(DialogState.FormShown)}
        />
        <QuizUrlInputDialog
            isVisible={dialogState === DialogState.FormShown}
            onFormSubmit={handleFormSubmit}
            onDismiss={hideDialog}
        />
        <QuizProcessingDialog
            isVisible={dialogState === DialogState.Processing}
            id={id}
            onDismiss={hideDialog}
        />
    </>
};




const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
});

export default AddQuizDialog;