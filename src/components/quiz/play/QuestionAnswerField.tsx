import {WholeQuestion} from "@/types/db";
import {QuestionType} from "@/db/question";
import React from "react";
import IdentificationField from "@/components/quiz/play/IdentificationField";
import MCQuestionField from "@/components/quiz/play/MCQuestionField";
import MSQuestionField from "@/components/quiz/play/MSQuestionField";
import {QuestionState} from "@/utils/questionColors";

interface QuestionAnswerFieldProps {
    question: WholeQuestion,
    onAnswer: (a: string[] | string) => void,
    state: QuestionState
}

function QuestionAnswerField(
    {
        question,
        onAnswer,
        state,
    }: QuestionAnswerFieldProps) {

    if (question.type === QuestionType.Blank) {
        return <IdentificationField
            onAnswer={onAnswer}
            state={state}
            answer={question.answerBlank!}
        />
    }

    if (question.type === QuestionType.MC) {
        return <MCQuestionField
            question={question}
            onAnswer={onAnswer}
            state={state}
        />
    }

    if (question.type === QuestionType.MS) {
        return <MSQuestionField
            question={question}
            onAnswer={onAnswer}
            state={state}
        />
    }

    return null;
}

export default QuestionAnswerField;