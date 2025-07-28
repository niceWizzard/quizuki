import React from 'react';
import { Card, Text } from 'react-native-paper';
import { ApiQuizSchema } from '@/utils/fetchSchema';

const QuestionCard = ({ question }: { question: ApiQuizSchema['questions'][number] }) => {
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
