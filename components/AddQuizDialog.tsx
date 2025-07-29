import {StyleSheet} from "react-native";
import {FAB} from "react-native-paper";
import React, {useCallback, useMemo, useState} from "react";
import QuizUrlInputDialog from "@/components/QuizUrlInputDialog";
import QuizFetchingDialog from "@/components/QuizFetchingDialog";
import AddQuizErrorDialog from "@/components/AddQuizErrorDialog";
import AddQuizProcessingDialog from "@/components/AddQuizProcessingDialog";
import {fetchQuiz, parseApiData} from "@/utils/quizFetch";
import {Quiz} from "@/types";
import {QuestionType} from "@/db/question";
import {deleteFile, downloadImageToCache} from "@/utils/download";
import {router} from "expo-router";

enum DialogState {
    FormShown,
    Fetching,
    Error,
    Hidden,
    Processing,
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


async function saveQuizToDatabase(quiz: Quiz, incrementProgress: () => void) {

    await wait(100); // Saving of quiz to db
    incrementProgress();

    for (const question of quiz.questions) {

        if (question.type === QuestionType.MC || question.type === QuestionType.MS) {
            for (const option of question.options) {
                await wait(100);
                incrementProgress(); // For saving of option
            }
        }

        await wait(100); // saving of question
        incrementProgress(); // For completing the question
    }
}

const processQuizData = async (data: Quiz, incrementProgress: () => void) => {
    
    const downloadedFiles : string[] = [];
    try {
        // Download and update main quiz image
        if (data.image) {
            data.image = await downloadImageToCache(data.image); // Update reference
            downloadedFiles.push(data.image);
            incrementProgress();
        }

        // Process questions
        for (const question of data.questions) {
            // Download and update question images
            const newQuestionImages = [];
            for (const image of question.images) {
                const cachedImage = await downloadImageToCache(image);
                downloadedFiles.push(cachedImage);
                newQuestionImages.push(cachedImage);
                incrementProgress();
            }
            question.images = newQuestionImages; // Update all question images

            // Process options if MC/MS question
            if (question.type === QuestionType.MC || question.type === QuestionType.MS) {
                for (const option of question.options) {
                    const newOptionImages = [];
                    for (const image of option.images) {
                        const cachedImage = await downloadImageToCache(image.url);
                        downloadedFiles.push(cachedImage);
                        newOptionImages.push({ ...image, url: cachedImage });
                        incrementProgress();
                    }
                    option.images = newOptionImages; // Update all option images
                }
            }

            incrementProgress(); // For completing the question
        }
        console.log("Processing complete with updated URLs:", JSON.stringify(data, null, 4));
        return JSON.parse(JSON.stringify(data)) as Quiz;
    } catch (error) {
        for (const file of downloadedFiles) {
            await deleteFile(file);
        }
        throw error;
    }
};



const AddQuizDialog = () => {
    const [dialogState, setDialogState] = useState(DialogState.Hidden);
    const [quizId, setQuizId] = useState('');
    const [error, setError] = useState<Error | undefined>();
    const [quizData, setQuizData] = useState<Quiz | undefined>();
    const [currentProgress, setCurrentProgress] = useState(0);

    const totalProgress = useMemo(() => {
        if (!quizData) return 0;

        let total = 1; // 1 for quiz

        // Count main quiz image
        if (quizData.image)
            total += 1;

        total += quizData.questions.length;

        // Count questions and their images
        for (const question of quizData.questions) {
            total += 1; // For processing the question itself
            total += question.images.length;

            if (question.type === QuestionType.MC || question.type === QuestionType.MS) {
                total += question.options.length;
                for (const option of question.options) {
                    total += option.images.length;
                }
            }
        }

        return total;
    }, [quizData]);

    function incrementProgress() {
        setCurrentProgress(v => v + 1);
    }

    const resetState = useCallback(() => {
        setQuizId('');
        setError(undefined);
        setQuizData(undefined);
        setCurrentProgress(0);
    }, []);

    const hideDialog = useCallback(() => {
        resetState();
        setDialogState(DialogState.Hidden);
    }, [resetState]);

    const fetchQuizData = useCallback(async (id: string) => {
        setDialogState(DialogState.Fetching);
        try {
            //Fetching Logic
            const apiData = await fetchQuiz(id);
            const parsedData = await parseApiData(apiData);
            
            // Processing logic (downloading images)
            setQuizData(parsedData);
            setDialogState(DialogState.Processing);
            setCurrentProgress(0); // Reset progress
            const processedData = await processQuizData(parsedData, incrementProgress);
            
            // Saving to Db
            await saveQuizToDatabase(processedData, incrementProgress);
            await wait(250);
            setDialogState(DialogState.Hidden);
            router.navigate('/settings');
            await wait(100);
            resetState();
        } catch (e) {
            setError(e as Error);
            setDialogState(DialogState.Error);
        }
    }, [resetState])

    const handleRetry = () => fetchQuizData(quizId);
    
    const handleFormSubmit = useCallback((id: string) => {
        setQuizId(id);
        fetchQuizData(id);
    }, [fetchQuizData]);
    return (
        <>
            <FAB
                icon="plus"
                style={styles.fab}
                disabled={dialogState !== DialogState.Hidden}
                onPress={() => setDialogState(DialogState.FormShown)}
                testID="add-quiz-fab"
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
                progress={totalProgress > 0 ? currentProgress / totalProgress : 0}
            />

            <AddQuizErrorDialog
                isVisible={dialogState === DialogState.Error}
                onErrorDismiss={hideDialog}
                onErrorRefetch={handleRetry}
                error={error}
            />
        </>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        elevation: 4,
    },
});

export default AddQuizDialog;