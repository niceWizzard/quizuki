import {WholeQuestion} from "@/types/db";
import {QuestionType} from "@/db/question";
import React from "react";
import IdentificationField from "@/components/quiz/play/IdentificationField";
import QuestionWithOptionsField from "@/components/quiz/play/QuestionWithOptions";

interface QuestionAnswerFieldProps {
    question: WholeQuestion,
    onAnswer: (a : string[] | string) => void,
}

function QuestionAnswerField(
    {
        question,
        onAnswer,
    }: QuestionAnswerFieldProps ) {

    if(question.type === QuestionType.Blank) {
        return <IdentificationField onAnswer={onAnswer} />
    }

    if(question.type === QuestionType.MC || question.type === QuestionType.MS) {
        return <QuestionWithOptionsField question={question} onAnswer={onAnswer} />
    }

    return null;
}

export default QuestionAnswerField;