import {WholeQuestion} from "@/types/db";
import {QuestionType} from "@/db/question";
import React from "react";
import IdentificationField from "@/components/quiz/play/IdentificationField";
import MCQuestionField from "@/components/quiz/play/MCQuestionField";
import MSQuestionField from "@/components/quiz/play/MSQuestionField";

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

    if(question.type === QuestionType.MC) {
        return <MCQuestionField question={question} onAnswer={onAnswer} />
    }

    if(question.type === QuestionType.MS) {
        return <MSQuestionField question={question} onAnswer={onAnswer} />
    }

    return null;
}

export default QuestionAnswerField;