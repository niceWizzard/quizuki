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
    let questionTypeLabel = "Unsupported";

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

    if(question.type === "Unsupported") {
        return <Card>
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
            </Card.Content>
        </Card>
    }


    function isCorrectAnswer(option : number, answer : number | number[]) : boolean {
        if(Array.isArray(answer)) {
            return answer.includes(option);
        }
        return option === answer;
    }
    const combinedHTML = `
        <div >
            ${question.structure.options.map((option, idx) => `
                <div class="optionItem">
                    <span class="optionIcon">${isCorrectAnswer(idx, question.structure.answer) ? '✅' : ''}</span>
                    ${option.media.map((media) => (`<img class="optionImage" src="${media.url}" />`))}
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
                        optionItem: {
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                        },
                        optionIcon: {
                            width: 24,
                            textAlign: 'center',
                            marginRight: 8,
                        },
                        optionImage: {
                            flexShrink: 0,
                            width: 128, // Small thumbnail size or adjust as needed
                            height: 128,
                            resizeMode: 'contain',
                            marginRight: 8,
                        },
                        optionText: {
                            flex: 1,
                            flexWrap: 'wrap',
                        },
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
