import React from 'react';
import {ActivityIndicator, ScrollView, View} from "react-native";
import {Text} from "react-native-paper";
import {useLocalSearchParams} from "expo-router";
import {useQuery} from "@tanstack/react-query";
import {Image} from "expo-image";

const PreviewScreen = () => {
    const { id } = useLocalSearchParams();

    const {data, isLoading} = useQuery({
        queryKey: ['preview', id],
        queryFn: async () => {
              const res = await fetch('https://wayground.com/quiz/'+id, {
                  method: 'GET',
              });
              return (await res.json()).data;
        },
    });

    if(isLoading) {
        return <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size="large"/>
        </View>
    }

    return (
        <ScrollView style={{padding: 16}}>
            {
                data.quiz.info.image && (
                    <Image
                        source={{ uri: data.quiz.info.image }}
                        style={{ width: '100%', height: 200 }}
                        contentFit="cover"
                        alt="Quiz image"
                    />
                )
            }
            <Text>{JSON.stringify(data.quiz, null, 3)}</Text>
        </ScrollView>
    );
};

export default PreviewScreen;