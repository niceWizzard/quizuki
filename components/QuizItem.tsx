import { View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";

const QuizItem = ({ quiz }: { quiz: { id: number; name: string } }) => (
    <View style={{ padding: 8 }}>
        <Text>{quiz.name}</Text>
    </View>
);

export default QuizItem;
