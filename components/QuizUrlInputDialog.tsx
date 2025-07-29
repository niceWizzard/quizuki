import React, {useEffect, useState} from "react";
import {Button, Dialog, Portal, Text, TextInput, useTheme} from "react-native-paper";
import {Keyboard, Platform, StyleSheet, View} from "react-native";
import {Controller, useForm} from "react-hook-form";
import {extractWaygroundQuizId, isValidWaygroundUrl} from "@/utils/url";
import {getStringAsync} from "expo-clipboard";

type FormData = {
    url: string;
};

interface QuizUrlInputDialogProps {
    isVisible: boolean,
    onFormSubmit: (id : string) => void,
    onDismiss: () => void
}

const QuizUrlInputDialog = ({isVisible, onFormSubmit, onDismiss}: QuizUrlInputDialogProps) => {
    const [keyboardOffset, setKeyboardOffset] = useState(0);
    const theme = useTheme();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardOffset(e.endCoordinates.height);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardOffset(0);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors, isValid},
        setValue,
        trigger,
    } = useForm<FormData>({
        mode: "onChange",
        defaultValues: {
            url: ''
        },
        resolver: async (values) => {
            const validUrl = isValidWaygroundUrl(values.url);
            const hasId = !!extractWaygroundQuizId(values.url);

            return {
                values,
                errors: {
                    ...(!values.url && {url: {type: "required", message: "URL is required"}}),
                    ...(values.url && !validUrl && {url: {type: "pattern", message: "Invalid Wayground URL"}}),
                    ...(values.url && validUrl && !hasId && {url: {type: "validate", message: "Missing quiz ID"}})
                }
            };
        }
    });


    function handleFormSubmit(form: FormData) {
        reset();
        onFormSubmit(extractWaygroundQuizId(form.url)!);
    }

    const handleDialogDismiss = () => {
        onDismiss();
        reset();
    };

    async function handlePasteClick() {
        const text = await getStringAsync();
        setValue("url", text, {shouldValidate: true, shouldDirty: true, shouldTouch: true});

        const isValid = await trigger("url");
        if (isValid) {
            await handleSubmit(handleFormSubmit)();
        }
    }

    return (
        <Portal>
            <Dialog
                visible={isVisible}
                onDismiss={handleDialogDismiss}
                style={[styles.dialog, {marginBottom: keyboardOffset}]}
            >
                <Dialog.Title>Add a Quiz</Dialog.Title>
                <Dialog.Content style={styles.content}>
                    <Controller
                        control={control}
                        name="url"
                        render={({field: {onChange, onBlur, value}}) => (
                            <>
                                <TextInput
                                    label="Wayground URL"
                                    placeholder="wayground.com/quiz/<id>"
                                    mode="outlined"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    onSubmitEditing={handleSubmit(handleFormSubmit)}
                                    autoFocus
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="url"
                                    error={!!errors.url}
                                    theme={{
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            error: theme.colors.error,
                                            primary: theme.colors.primary
                                        }
                                    }}
                                />
                                {errors.url && (
                                    <Text
                                        variant="bodySmall"
                                        style={[styles.errorText, {color: theme.colors.error}]}
                                    >
                                        {errors.url.message}
                                    </Text>
                                )}
                            </>
                        )}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={handlePasteClick}>Paste</Button>
                    <View style={styles.actionsContainer}>
                        <Button onPress={() => reset()}>Clear</Button>
                        <Button
                            mode="contained"
                            onPress={handleSubmit(handleFormSubmit)}
                            disabled={!isValid}
                            theme={theme}
                        >
                            Add Quiz
                        </Button>
                    </View>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}


const styles = StyleSheet.create({

    dialog: {
        marginHorizontal: 16,
    },
    content: {
        paddingVertical: 8,
        gap: 8,
    },
    errorText: {
        marginTop: 4,
        marginLeft: 8
    },
    actionsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end"
    }
});

export default QuizUrlInputDialog;