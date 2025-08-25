import {TouchableOpacity, useWindowDimensions, View} from "react-native";
import {useTheme} from "react-native-paper";
import {WholeQuestion} from "@/types/db";
import RenderHTML from "react-native-render-html";
import {Image} from "expo-image";
import shuffle from "lodash.shuffle";
import {getOptionBgColor, QuestionState} from "@/utils/questionColors";
import {useMemo, useState} from "react";


function MCQuestionField({question, onAnswer, state}: {
    question: WholeQuestion,
    onAnswer: (a: (string[] | string)) => void,
    state: QuestionState
}) {
    const {colors, fonts} = useTheme()
    const {width} = useWindowDimensions();
    const [selectedOption, setSelectedOption] = useState('')

    const shuffledOptions = useMemo(() => shuffle(question.options), [question.options])

    return <View style={{
        width: '100%', flexGrow: 0, justifyContent: 'center',
        gap: 8,
    }}
    >
        {
            shuffledOptions.map((option, i) => (
                <TouchableOpacity
                    key={`option-${option.id}`}
                    style={{
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: getOptionBgColor(
                            state,
                            colors,
                            selectedOption === option.onlineId,
                            option.onlineId === question.answerMultipleChoice!,
                        ),
                    }}
                    disabled={!!selectedOption}
                    onPress={() => {
                        setSelectedOption(option.onlineId)
                        onAnswer([option.onlineId])
                    }}
                >
                    {
                        option.text ? (
                            <RenderHTML
                                source={{html: option.text}}
                                contentWidth={width}
                                defaultTextProps={{
                                    style: {
                                        color: colors.onBackground,
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
    </View>;
}


export default MCQuestionField;