import {TouchableOpacity, useWindowDimensions, View} from "react-native";
import {Button, Text, useTheme} from "react-native-paper";
import {QuestionOption, WholeQuestion} from "@/types/db";
import RenderHTML from "react-native-render-html";
import {Image} from "expo-image";
import shuffle from "lodash.shuffle";
import {useMemo, useState} from "react";
import {getOptionBgColor, getTextColor, QuestionState} from "@/utils/questionColors";


function MCQuestionField({question, onAnswer, state}: {
    question: WholeQuestion,
    onAnswer: (a: (string[] | string)) => void,
    state: QuestionState
}) {
    const {colors, fonts} = useTheme()
    const {width} = useWindowDimensions();
    const shuffledOptions = useMemo(() => shuffle(question.options), [question.options]);
    const [selectedOptions, setSelectedOptions] = useState<{[key: string]: boolean}>({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    function handleSubmit() {
        setHasSubmitted(true);
        onAnswer(Object.keys(selectedOptions))
    }

    function toggleOption(optionOnlineId: string) {
        const toggleValue = !selectedOptions[optionOnlineId];
        if(toggleValue && Object.values(selectedOptions).filter(v => v).length >= question.answerMultipleSelection!.length) {
            return;
        }

        setSelectedOptions({
            ...selectedOptions,
            [optionOnlineId]: toggleValue,
        });
    }

    function optionBgColor(option: QuestionOption) {
        const isSelected = selectedOptions[option.onlineId];
        if(hasSubmitted) {
            return getOptionBgColor(
                state,
                colors,
                isSelected,
                question.answerMultipleSelection!.includes(option.onlineId),
            )
        }
        if(isSelected) {
            return colors.tertiary;
        }
        return colors.elevation.level2
    }

    function getOptionTextColor(option: QuestionOption) {
        if(selectedOptions[option.onlineId] ) {
            return colors.onTertiary;
        }
        return colors.onBackground;
    }

    return <View style={{
        width: '100%', flexGrow: 0, justifyContent: 'center',
        gap: 8,
    }}
    >
        <Text style={{color: getTextColor(state, colors)}}
        >Select up to {question.answerMultipleSelection!.length}</Text>
        {
            shuffledOptions.map((option, i) => (
                <TouchableOpacity
                    key={`option-${option.id}`}
                    style={{
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: optionBgColor(option),
                    }}
                    disabled={hasSubmitted}
                    onPress={() => {
                        toggleOption(option.onlineId)
                    }}
                >
                    {
                        option.text ? (
                            <RenderHTML
                                source={{html: option.text}}
                                contentWidth={width}
                                defaultTextProps={{
                                    style: {
                                        color: getOptionTextColor(option),
                                        fontWeight: fonts.bodyMedium.fontWeight,
                                        fontSize: fonts.bodyMedium.fontSize,
                                        lineHeight: fonts.bodyMedium.lineHeight,
                                    }
                                }}
                            />
                        ) : null
                    }
                    {
                        option.images.map((image, i) => (
                            <Image
                                source={{uri: image}}
                                key={`option-${option.id}-image-${image}`}
                                style={{width: '100%', minHeight: 96, height: 'auto', marginTop: 8}}
                                contentFit={'contain'}
                            />
                        ))
                    }
                </TouchableOpacity>
            ))
        }
        <Button onPress={handleSubmit}
                disabled={hasSubmitted}
        >Submit</Button>
    </View>;
}


export default MCQuestionField;