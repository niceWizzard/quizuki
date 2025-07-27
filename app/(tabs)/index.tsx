import { useDrizzleStore } from "@/store/useDrizzleStore";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { router } from "expo-router";
import { View } from "react-native";
import { FAB, Text } from "react-native-paper";

const IndexScreen = () => {
    const drizzle = useDrizzleStore(v => v.drizzle!);
    const {data: fetchedQuizzes} = useLiveQuery(
        drizzle.query.quizTable.findMany()
    );
    return (
        <View style={{flex: 1, padding: 8,}}>
            <FAB
                icon="plus"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    margin: 8,
                }}
                onPress={() => router.navigate('/quiz/create')}
            />
            {
                fetchedQuizzes.length > 0 ? (
                    fetchedQuizzes.map((quiz) => (
                        <View key={quiz.id}>
                            <Text>{quiz.name}</Text>
                        </View>
                    ))
                ) : (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>No Quiz yet. Add one!</Text>
                    </View>
                )
            }
        </View>
    );
};

export default IndexScreen;