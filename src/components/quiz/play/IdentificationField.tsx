import {Button, TextInput} from "react-native-paper";
import React from "react";
import {Controller, useForm} from "react-hook-form";
import {View} from "react-native";

function IdentificationField ({onAnswer} : {onAnswer: (answer: string) => void}) {
    const {
        control,
        handleSubmit,
    } = useForm<{answer: string}>({
        defaultValues: {
            answer: '',
        }
    })

    function handleAnswerSubmit(form: {answer: string}) {
        onAnswer(form.answer.trim())
    }

    return <View
        style={{ width: "100%", gap: 8}}
    >
        <Controller
            name="answer"
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                    label="Your Answer"
                    mode="flat"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={text => onChange(text)}
                    onSubmitEditing={handleSubmit(handleAnswerSubmit)}
                    autoFocus
                />
            )}
        />
        <Button onPress={handleSubmit(handleAnswerSubmit)}>
            Submit
        </Button>
    </View>
}

export default IdentificationField;