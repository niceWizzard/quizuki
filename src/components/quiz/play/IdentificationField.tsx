import {Button, Text, TextInput, useTheme} from "react-native-paper";
import React, {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {View} from "react-native";
import {getTextColor, QuestionState} from "@/utils/questionColors";

function IdentificationField({onAnswer, state, answer}: {
    onAnswer: (answer: string) => void,
    state: QuestionState,
    answer: string,
}) {
    const {
        control,
        handleSubmit,
    } = useForm<{answer: string}>({
        defaultValues: {
            answer: '',
        }
    });
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const {colors}= useTheme();
    function handleAnswerSubmit(form: {answer: string}) {
        setHasSubmitted(true);
        onAnswer(form.answer.trim())
    }
    const textColor = getTextColor(state, colors)
    return <View
        style={{ width: "100%", gap: 8}}
    >
        <Controller
            name="answer"
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                    label="Your Answer"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={text => onChange(text)}
                    onSubmitEditing={handleSubmit(handleAnswerSubmit)}
                    textColor={textColor}
                    outlineColor={textColor}
                    selectionColor={textColor}
                    activeOutlineColor={textColor}
                    placeholderTextColor={textColor}
                    selectionHandleColor={textColor}
                    disabled={hasSubmitted}
                    autoFocus
                />
            )}
        />
        {
            state === QuestionState.Incorrect ? (
                <Text style={{color: textColor}}>
                    Correct Answer: {answer}
                </Text>
            ) : null
        }
        <Button onPress={handleSubmit(handleAnswerSubmit)}
                disabled={hasSubmitted}
        >
            Submit
        </Button>

    </View>
}

export default IdentificationField;