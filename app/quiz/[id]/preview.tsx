import React from 'react';
import {ActivityIndicator, ScrollView, View} from "react-native";
import {Text} from "react-native-paper";
import {useLocalSearchParams} from "expo-router";
import {useQuery} from "@tanstack/react-query";

const PreviewScreen = () => {
    const { id } = useLocalSearchParams();

    const {data, isLoading} = useQuery({
        queryKey: ['preview', id],
        queryFn: async () => {
              const res = await fetch('https://wayground.com/quiz/'+id, {
                  method: 'GET',
              });
              return await res.json();
        },
    });

    if(isLoading) {
        return <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size="large"/>
        </View>
    }

    return (
        <ScrollView style={{padding: 16}}>
            <Text>PreviewScreen {id}</Text>
            <Text>{JSON.stringify(data)}</Text>
        </ScrollView>
    );
};

export default PreviewScreen;