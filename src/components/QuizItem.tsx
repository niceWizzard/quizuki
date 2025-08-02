import React, {memo} from "react";
import {Card, Text} from "react-native-paper";
import {Quiz} from "@/types/db";
import {Image} from "expo-image";
import {router} from "expo-router";

const QuizItem = ({ quiz }: {quiz: Quiz} ) => (
    <Card
        onPress={() => router.navigate({
            pathname: '/quiz/[id]',
            params: {id: quiz.id},
        })}
        style={{ flex: 1, margin: 4 }} // Add flex: 1 and margin
    >
        <Card.Content>
            <Image
                style={{width: '100%', height: 150}}
                source={{uri: quiz.image}}
                contentFit="contain"
            />
            <Text>{quiz.name}</Text>
        </Card.Content>
    </Card>
);

export default memo(QuizItem);
