import { View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import {Quiz} from "@/db/schema";

const QuizItem = ({ quiz }: {quiz: Quiz} ) => (
    <View style={{ padding: 8 }}>
        <Text>{quiz.name}</Text>
        <Text>{quiz.waygroundId}</Text>
    </View>
);

export default QuizItem;
