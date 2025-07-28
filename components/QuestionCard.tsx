import React from 'react';
import { Card, Text } from 'react-native-paper';
import {z} from 'zod';
import {ApiQuizSchema, QuizSchema} from '@/utils/fetchSchema';


type Quiz = z.infer<typeof QuizSchema>;



const QuestionCard = ({ question }: { question: Quiz["questions"][number] }) => {
    return (
        <Card>
            <Card.Title title={question.structure.query.text} />
            <Card.Content>
                {question.structure.options.map((option) => (
                    <Text key={option.id}>{option.text}</Text>
                ))}
            </Card.Content>
        </Card>
    );
};

export default QuestionCard;
