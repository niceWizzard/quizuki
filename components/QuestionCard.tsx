import React from 'react';
import {Card, Divider, Text} from 'react-native-paper';
import {z} from 'zod';
import {ApiQuizSchema, QuizSchema} from '@/utils/fetchSchema';
import {Image} from "expo-image";


type Quiz = z.infer<typeof QuizSchema>;



const QuestionCard = ({ question,index }: { question: Quiz["questions"][number],index:number }) => {
    return (
        <Card>
            <Card.Content>
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
                <Text variant="titleSmall">{index+1}. {question.structure.query.text}</Text>
                <Divider style={{marginBottom: 8}} />
                {question.structure.options.map((option) => (
                    <Text key={option.id}>{option.text}</Text>
                ))}
            </Card.Content>
        </Card>
    );
};

export default QuestionCard;
