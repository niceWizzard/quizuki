import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { View, FlatList } from "react-native";
import React, {useEffect} from "react";
import QuizItem from "@/components/QuizItem";
import AddQuizDialog from "@/components/AddQuizDialog";
import {Text} from "react-native-paper";
import {useRepositoryStore} from "@/store/useRepositoryStore";

const IndexScreen = () => {
    const quizRepo = useRepositoryStore(v => v.quiz!);
    const { data: fetchedQuizzes = [] } = useLiveQuery(
        quizRepo.getQuizzes()
    );

    return (
        <View style={{ flex: 1, padding: 8, }}>
            <FlatList
                data={fetchedQuizzes}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: 'space-between', // This ensures equal spacing
                    gap: 8, // Add gap between items
                }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ flex: 0.6}}>
                        <QuizItem quiz={item} />
                    </View>
                )}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>No Quiz yet. Add one!</Text>
                    </View>
                }
            />
            <AddQuizDialog
            />
        </View>
    );
};

export default IndexScreen;