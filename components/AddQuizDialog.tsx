import {View, StyleSheet, Keyboard, Platform} from "react-native";
import { Button, Dialog, FAB, Portal, TextInput, Text, useTheme } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { extractWaygroundQuizId, isValidWaygroundUrl } from "@/utils/url";

type FormData = {
    url: string;
};

const AddQuizDialog = ({ onSubmit }: { onSubmit: (waygroundId: string) => void }) => {
    const theme = useTheme();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [keyboardOffset, setKeyboardOffset] = useState(0);

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
        watch,
        formState: { errors, isValid }
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
                    ...(!values.url && { url: { type: "required", message: "URL is required" } }),
                    ...(values.url && !validUrl && { url: { type: "pattern", message: "Invalid Wayground URL" } }),
                    ...(values.url && validUrl && !hasId && { url: { type: "validate", message: "Missing quiz ID" } })
                }
            };
        }
    });

    const handleFormSubmit = (data: FormData) => {
        onSubmit(extractWaygroundQuizId(data.url)!);
        onDismiss();
    };

    const onDismiss = () => {
        setDialogVisible(false);
        reset();
    };

    return (
        <>
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => setDialogVisible(true)}
            />
            <Portal>
                <Dialog
                    visible={dialogVisible}
                    onDismiss={onDismiss}
                    style={[styles.dialog, { marginBottom: keyboardOffset }]}
                >
                    <Dialog.Title>Add a Quiz</Dialog.Title>
                    <Dialog.Content style={styles.content}>
                        <Controller
                            control={control}
                            name="url"
                            render={({ field: { onChange, onBlur, value } }) => (
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
                                            style={{
                                                color: theme.colors.error,
                                                marginTop: 4,
                                                marginLeft: 8
                                            }}
                                        >
                                            {errors.url.message}
                                        </Text>
                                    )}
                                </>
                            )}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={onDismiss}>
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleSubmit(handleFormSubmit)}
                            disabled={!isValid}
                            theme={theme}
                        >
                            Add Quiz
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    dialog: {
        marginHorizontal: 16,
    },
    content: {
        paddingVertical: 8,
        gap: 8,
    },
});

export default AddQuizDialog;