import React from 'react';
import {ActivityIndicator, FlatList, View} from "react-native";
import {Card, Text} from "react-native-paper";
import {useRepositoryStore} from "@/store/useRepositoryStore";
import {useLiveQuery} from "drizzle-orm/expo-sqlite";
import {router} from "expo-router";

const HistoryScreen = () => {
    const playRepo = useRepositoryStore(v => v.play!);

    const {
        data: allPlays,
        error,
        updatedAt
    } = useLiveQuery(
        playRepo.getAllPlays()
    );

    const isLoading = !updatedAt;

    if(error) {
        return <View style={{flex: 1, paddingHorizontal: 8, paddingVertical: 12}}>
            <Text>{error.message}</Text>
        </View>
    }

    if(isLoading) {
        return <View style={{flex: 1, paddingHorizontal: 8, paddingVertical: 12}}>
            <ActivityIndicator/>
        </View>
    }

    return (
        <FlatList
            data={allPlays}
            keyExtractor={(item) => item.quizId!.toString()}
            contentContainerStyle={{ padding: 16, gap: 8 }}
            ListEmptyComponent={
                <Text>No plays yet.</Text>
            }
            renderItem={({ item }) => (
                <Card onPress={() => {
                    router.navigate({
                        pathname: '/quiz/[id]/pregame',
                        params: {
                            id: item.quizId!,
                        }
                    })
                }}>
                    <Card.Content style={{gap: 8}}>
                        <Text>{item.quiz?.name}</Text>
                        <Text variant="bodySmall">{item.startedAt.toString()}</Text>
                    </Card.Content>
                </Card>
            )}
        />
    );
};

export default HistoryScreen;
