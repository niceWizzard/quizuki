import {StyleSheet} from "react-native";
import {FAB} from "react-native-paper";
import React, {useState} from "react";
import QuizUrlInputDialog from "@/components/QuizUrlInputDialog";
import QuizFetchingDialog from "@/components/QuizFetchingDialog";
import {
    ApiQuestion, ApiQuizSchema,
    BlankQuestion,
    MCQuestion,
    MSQuestion,
    Question,
    UnsupportedQuestion,
    Quiz,
} from "@/types";
import {QuestionType} from "@/db/question";
import AddQuizErrorDialog from "@/components/AddQuizErrorDialog";
import AddQuizProcessingDialog from "@/components/AddQuizProcessingDialog";
import {fetchQuiz, parseApiData} from "@/utils/quizFetch";



enum DialogState {
    FormShown,
    Fetching,
    Error,
    Hidden,
    Processing,
}

const AddQuizDialog = () => {
    const [dialogState, setDialogState] = useState(DialogState.Hidden);
    const [id, setId] = useState('')
    const [error, setError] = useState<Error|undefined>();
    const [data, setData] = useState<Quiz|undefined>();


    const handleFormSubmit = (id: string) => {
        setId(id);
        fetch(id);
    };

    const hideDialog = () => {
        setDialogState(DialogState.Hidden)
    }

    async function fetch(id : string) {
        setDialogState(DialogState.Fetching);
        try {
            const apiData = await fetchQuiz(id);
            const data = await parseApiData(apiData);
            setData(data);
            setDialogState(DialogState.Processing);
        } catch (e) {
            const err = e as Error;
            setError(err);
            setDialogState(DialogState.Error);
        }
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
        <QuizFetchingDialog
            isVisible={dialogState === DialogState.Fetching}
        />
        <AddQuizProcessingDialog
            isVisible={dialogState === DialogState.Processing}
            quizData={data}
        />
        <AddQuizErrorDialog
            isVisible={dialogState === DialogState.Error}
            onErrorDismiss={hideDialog}
            onErrorRefetch={() => fetch(id)}
            error={error}
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