import React, {useEffect, useRef, useState} from 'react';
import {useWindowDimensions} from "react-native";
import {Card, Text, useTheme} from "react-native-paper";
import {Play, WholeQuestion} from "@/types/db";
import {QuestionType} from "@/db/question";
import {router} from "expo-router";
import RenderHTML from "react-native-render-html";
import QuestionAnswerField from "@/components/quiz/play/QuestionAnswerField";
import {Image} from "expo-image";
import {getTextColor, QuestionState} from "@/utils/questionColors";

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
    const {colors, fonts} = useTheme();
    const [questionState, setQuestionState] = useState(QuestionState.Answering);
    const timeoutCancel = useRef<number|null>(null);

    useEffect(() => {
        return () => {
            if(timeoutCancel.current)
                clearTimeout(timeoutCancel.current)
        }
    }, []);


    function onQuestionAnswered(a : string[] | string) {
        let isCorrect = false;
        if(question.type === QuestionType.Blank) {
            const answer = a as string;
            isCorrect = question.answerBlank!
                .replaceAll("/<[^>]*>/g", "")
                .toLowerCase() === answer.toLowerCase()
        } else if (question.type === QuestionType.MC) {
            const answer = a as string[];
            isCorrect = question.answerMultipleChoice === answer[0];
        } else if(question.type === QuestionType.MS) {
            const answer = a as string[];
            isCorrect = question.answerMultipleSelection!.every(v => answer.includes(v));
        }
        setQuestionState(isCorrect ? QuestionState.Correct : QuestionState.Incorrect);
        timeoutCancel.current = setTimeout(() => {
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
        }, 1000);
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
                            color: getTextColor(questionState, colors),
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
            state={questionState}
        />
    </>;
}


export default QuestionDisplay;