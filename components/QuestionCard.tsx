import React, {memo} from 'react';
import {Card, Divider, Text, useTheme} from 'react-native-paper';
import {z} from 'zod';
import {ApiQuizSchema, QuizSchema} from '@/utils/fetchSchema';
import {Image} from "expo-image";
import RenderHTML from "react-native-render-html";
import {useWindowDimensions, View} from "react-native";


type Quiz = z.infer<typeof QuizSchema>;



const QuestionCardComp = ({ question,index }: { question: Quiz["questions"][number],index:number }) => {
    const {colors, fonts} = useTheme();
    const {width} = useWindowDimensions();
    let questionTypeLabel = "Uknown";

    switch (question.type) {
        case "MSQ":
            questionTypeLabel = "Multiple Selection";
            break;
        case "MCQ":
            questionTypeLabel = "Multiple Choice";
            break;
        case "BLANK":
            questionTypeLabel = "Identification";
            break;
    }
    function isCorrectAnswer(option : number, answer : number | number[]) : boolean {
        if(Array.isArray(answer)) {
            return answer.includes(option);
        }
        return option === answer;
    }
    const combinedHTML = `
            <div class="optionsContainer">
                ${question.structure.options.map((option, idx) => `
                    <div class="optionItem">
                        <span class="optionIcon">${isCorrectAnswer(idx, question.structure.answer) ? '✅' : ''}</span>
                        <span class="optionText">${option.text}</span>
                    </div>
                `).join('')}
            </div>
        `;


    return (
        <Card>
            <Card.Content>
                <Text style={{marginBottom: 8}}>{index+1}. {questionTypeLabel}</Text>
                {
                    question.structure.query.media.length  ? (
                        question.structure.query.media.map(v => (
                            <Image
                                key={v.url}
                                source={{uri: v.url}}
                                style={{width: "100%", height: 256}}
                                contentFit="contain"
                            />
                        ))
                    ) : null
                }
                <Divider style={{marginVertical: 8}} />
                <RenderHTML
                    source={{html: question.structure.query.text.trim().replace(/<p><br\s*\/?><\/p>/gi, '')}}
                    contentWidth={width}
                    defaultTextProps={{
                        style: {
                            color: colors.onBackground,
                            fontWeight: fonts.titleMedium.fontWeight,
                            fontSize: fonts.titleMedium.fontSize,
                            lineHeight: fonts.titleMedium.lineHeight,
                        }
                    }}
                />
                <RenderHTML
                    source={{ html: combinedHTML }}
                    ignoredDomTags={['math']}
                    contentWidth={width}
                    classesStyles={{
                        optionsContainer: {
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                        },
                        optionItem: {
                            width: '48%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 4,
                        },
                        optionIcon: {
                            width: 24,
                            textAlign: 'center',
                        },
                        optionText: {
                            flexShrink: 1,
                        }
                    }}
                    defaultTextProps={{
                        style: {
                            color: colors.onBackground,
                            fontWeight: fonts.bodyMedium.fontWeight,
                            fontSize: fonts.bodyMedium.fontSize,
                            lineHeight: fonts.bodyMedium.lineHeight,
                        }
                    }}
                />
            </Card.Content>
        </Card>
    );
};

const QuestionCard = memo(QuestionCardComp);

export default QuestionCard;
