import { useDrizzleStore } from "@/store/useDrizzleStore";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { View, FlatList } from "react-native";
import React from "react";
import {quizTable} from "@/db/schema";
import QuizItem from "@/components/QuizItem";
import AddQuizDialog from "@/components/AddQuizDialog";
import {Text} from "react-native-paper";

const IndexScreen = () => {
    const drizzle = useDrizzleStore(v => v.drizzle!);
    const { data: fetchedQuizzes = [] } = useLiveQuery(
        drizzle.query.quizTable.findMany()
    );

    async function onSubmit(waygroundId : string) {
        await drizzle.insert(quizTable).values({
            name: "LJKSDF",
            waygroundId: waygroundId,
        });
    }

    return (
        <View style={{ flex: 1, padding: 8, }}>
            <FlatList
                data={fetchedQuizzes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <QuizItem quiz={item} />}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>No Quiz yet. Add one!</Text>
                    </View>
                }
            />
            <AddQuizDialog
                onSubmit={onSubmit}
            />
        </View>
    );
};

export default IndexScreen;