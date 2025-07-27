import React from 'react';
import {ActivityIndicator, FlatList, ScrollView, View} from "react-native";
import {Card, Text} from "react-native-paper";
import {useLocalSearchParams} from "expo-router";
import {useQuery} from "@tanstack/react-query";
import {Image} from "expo-image";
import {QuizSchema} from "@/utils/fetchSchema";

const PreviewScreen = () => {
    const { id } = useLocalSearchParams();

    const {data, isLoading, error} = useQuery({
        queryKey: ['preview', id],
        queryFn: async () => {
              const res = await fetch('https://wayground.com/quiz/'+id, {
                  method: 'GET',
              });
              const apiData = (await res.json()).data.quiz;
              const data = await QuizSchema.parseAsync(apiData)
            if(!data)
                throw new Error("Unable to parse.");
            return data;
        },
    });

    if( error) {
        return <View style={{flex: 1,}}>
            <Text>Something went wrong: {error?.message}</Text>
        </View>;
    }

    if(isLoading) {
        return <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size="large"/>
        </View>
    }

    const quiz = data!;

    return (
        <FlatList
            data={quiz.questions}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 32, }}
            ListHeaderComponent={
                <>
                    {data!.image && (
                        <Image
                            source={{ uri: data!.image }}
                            style={{ width: '100%', height: 200 }}
                            contentFit="cover"
                        />
                    )}
                    <Text variant="titleLarge">{quiz.name}</Text>
                    <Text variant="bodySmall">{quiz.createdBy}</Text>
                    <Text variant="titleMedium">Questions</Text>
                </>
            }
            renderItem={({ item }) => (
                <Card>
                    <Card.Title title={item.structure.query.text} />
                    <Card.Content>
                        {item.structure.options.map((option, index) => (
                            <Text key={option.id}>
                                {option.text}
                            </Text>
                        ))}
                    </Card.Content>
                </Card>
            )}
        />
    );
};

export default PreviewScreen;