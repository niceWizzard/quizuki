import React from 'react';
import {ToastAndroid, useWindowDimensions} from "react-native";
import {Card, Text, useTheme} from "react-native-paper";
import {Play, WholeQuestion} from "@/types/db";
import {QuestionType} from "@/db/question";
import {router} from "expo-router";
import RenderHTML from "react-native-render-html";
import QuestionAnswerField from "@/components/quiz/play/QuestionAnswerField";
import {Image} from "expo-image";

interface QuestionDisplayProps {
    questionIndex: number,
    activePlay: Play,
    question: WholeQuestion,
    hasNextQuestion: boolean,
    quizId: number
}

function QuestionDisplay({
                             question,
                             activePlay,
                             questionIndex,
                             quizId,
                             hasNextQuestion,
                         } : QuestionDisplayProps) {

    const {width} = useWindowDimensions();
    const {colors, fonts} = useTheme()

    function onQuestionAnswered(a : string[] | string) {
        if(question.type === QuestionType.Blank) {
            const answer = a as string;
            const isCorrect = question.answerBlank!
                .replaceAll("/<[^>]*>/g", "")
                .toLowerCase() === answer.toLowerCase()
            ToastAndroid.show(isCorrect ? "Correct!" : "Wrong!", ToastAndroid.SHORT);
        } else if (question.type === QuestionType.MC) {
            const answer = a as string[];
            const isCorrect = question.answerMultipleChoice === answer[0];
            ToastAndroid.show(isCorrect ? "Correct!" : "Wrong!", ToastAndroid.SHORT);
        }
        if(hasNextQuestion) {
            router.replace({
                pathname: '/quiz/[id]/play/[question]',
                params: {
                    id: quizId,
                    question: questionIndex + 1,
                }
            })
        } else {
            router.replace({
                pathname: '/quiz/[id]/postgame',
                params: {
                    id: quizId,
                }
            })
        }
    }

    return <>
        <Card style={{width: '100%'}}>
            <Card.Content style={{gap: 16}}>
                <Text variant="bodySmall" style={{textAlign: 'center'}}>
                    {questionIndex + 1} out of {activePlay.questionOrder.length}
                </Text>
                <RenderHTML
                    source={{html: question.text}}
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
                {question.images.map((path) => (<Image
                    key={path}
                    source={{uri: path}}
                    style={{width: '100%', minHeight: 256, height: 'auto'}}
                    contentFit={'contain'}
                />))}
            </Card.Content>
        </Card>
        <QuestionAnswerField
            question={question}
            onAnswer={onQuestionAnswered}
        />
    </>;
}


export default QuestionDisplay;