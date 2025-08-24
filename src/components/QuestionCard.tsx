import React, {memo} from 'react';
import {Card, Divider, Text, useTheme} from 'react-native-paper';
import {Image} from "expo-image";
import RenderHTML from "react-native-render-html";
import {useWindowDimensions} from "react-native";
import {QuestionType} from "@/db/question";
import {WholeQuestion} from "@/types/db";


const QuestionCardComp = ({ question,index }: { question: WholeQuestion,index:number }) => {
    const {colors, fonts} = useTheme();
    const {width} = useWindowDimensions();
    let questionTypeLabel = "Unsupported";

    switch (question.type) {
        case QuestionType.MS:
            questionTypeLabel = "Multiple Selection";
            break;
        case QuestionType.MC:
            questionTypeLabel = "Multiple Choice";
            break;
        case QuestionType.Blank:
            questionTypeLabel = "Identification";
            break;
    }

    if(question.type === QuestionType.Unsupported) {
        return <Card>
            <Card.Content>
                <Text style={{marginBottom: 8}}>{index+1}. {questionTypeLabel}</Text>
                {
                    question.images.length  ? (
                        question.images.map(v => (
                            <Image
                                key={v}
                                source={{uri: v}}
                                style={{width: "100%", height: 256}}
                                contentFit="contain"
                            />
                        ))
                    ) : null
                }
                <Divider style={{marginVertical: 8}} />
                <RenderHTML
                    source={{html: question.text.trim().replace(/<p><br\s*\/?><\/p>/gi, '')}}
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


    function isCorrectAnswer(optionOnlineId : string, answerOnlineId : string | string[]) : boolean {
        if(Array.isArray(answerOnlineId)) {
            return answerOnlineId.includes(optionOnlineId);
        }
        return optionOnlineId === answerOnlineId;
    }
    let combinedHTML = '';

    switch (question.type) {
        case QuestionType.MS:
        case QuestionType.MC:
          combinedHTML = `
            <div >
                ${question.options.map((option, idx) => `
                    <div class="optionItem">
                        <span class="optionIcon">${isCorrectAnswer(option.onlineId, (question.answerMultipleSelection ?? question.answerMultipleChoice)!) ? '✅' : ''}</span>
                        ${option.images.map((url) => (`<img class="optionImage" src="${url}" />`))}
                        <span class="optionText">${option.text}</span>
                    </div>
                `).join('')}
            </div>
        `
            break;
          case QuestionType.Blank:
              combinedHTML = `
                <div >
                    <div class="optionItem">
                        <span class="optionIcon">✅</span>
                        <span class="optionText">${question.answerBlank}</span>
                    </div>
                </div>
            `
    }

    return (
        <Card>
            <Card.Content>
                <Text style={{marginBottom: 8}}>{index+1}. {questionTypeLabel}</Text>
                {
                    question.images.length  ? (
                        question.images.map(v => (
                            <Image
                                key={v}
                                source={{uri: v}}
                                style={{width: "100%", height: 256}}
                                contentFit="contain"
                            />
                        ))
                    ) : null
                }
                <Divider style={{marginVertical: 8}} />
                <RenderHTML
                    source={{html: question.text.trim().replace(/<p><br\s*\/?><\/p>/gi, '')}}
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
