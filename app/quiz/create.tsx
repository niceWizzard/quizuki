import React, {useState} from 'react';
import {View} from "react-native";
import {Button, Text, TextInput} from "react-native-paper";
import {useDrizzleStore} from "@/store/useDrizzleStore";
import {quizTable} from "@/db/schema";
import {router} from "expo-router";

const QuizCreateScreen = () => {
    const drizzle = useDrizzleStore(v => v.drizzle!);
    const [form, setForm] = useState({
        name: "",
        waygroundUrl: '',
    });

    async function handleSubmit() {
        if(!isValid)
            return;
        await drizzle.insert(quizTable).values({
            name: form.name,
            waygroundId: form.waygroundUrl,
        });
        router.back();
    }

    const isValid = form.name.trim() !== '' && form.waygroundUrl.trim() !== '';


    return (
        <View style={{padding: 8, gap: 8}}>
            <Text variant="titleMedium">Cerate Screen</Text>
            <TextInput
                label="Name"
                placeholder="Enter quiz name..."
                mode="outlined"
                value={form.name}
                onChangeText={(v) => setForm({...form, name: v})}
            />
            <TextInput
                label="Wayground Url"
                placeholder="Enter wayground url..."
                mode="outlined"
                value={form.waygroundUrl}
                onChangeText={(v) => setForm({...form, waygroundUrl: v})}
                onSubmitEditing={handleSubmit}
            />
            <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={!isValid}
            >Create</Button>
        </View>
    );
};

export default QuizCreateScreen;