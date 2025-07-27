import { View } from "react-native";
import { Button, Dialog, FAB, Portal, TextInput, useTheme } from "react-native-paper";
import React, { useState } from "react";

const AddQuizDialog = ({ onSubmit }: { onSubmit: (v: string) => void }) => {
    const theme = useTheme();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [url, setUrl] = useState('');

    const isValid = /^(https?:\/\/)?(www\.)?(quizizz\.com|wayground\.com)(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/.test(url);

    function handleSubmit() {
        if (!isValid) return;
        onDismiss();
        onSubmit(url);
    }

    function onDismiss() {
        setDialogVisible(false);
        setUrl('');
    }

    return (
        <>
            <FAB
                icon="plus"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    margin: 8,
                }}
                onPress={() => setDialogVisible(true)}
            />
            <Portal>
                <Dialog
                    visible={dialogVisible}
                    onDismiss={onDismiss}
                    theme={{ colors: { backdrop: 'none' } }}
                >
                    <Dialog.Title>Add a Quiz</Dialog.Title>
                    <Dialog.Content>
                        <View style={{ padding: 8, gap: 8 }}>
                            <TextInput
                                style={{ backgroundColor: theme.colors.secondaryContainer }}
                                label="Wayground Url"
                                placeholder="wayground.com/quiz/<id>"
                                mode="outlined"
                                value={url}
                                onChangeText={(v) => setUrl(v)}
                                onSubmitEditing={handleSubmit}
                                autoFocus
                            />
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={() => setDialogVisible(false)}
                            mode="text"
                        >
                            Cancel
                        </Button>
                        <Button
                            onPress={handleSubmit}
                            mode="contained"
                            style={{ paddingHorizontal: 8 }}
                            disabled={!isValid}
                        >
                            Done
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
};

export default AddQuizDialog;
