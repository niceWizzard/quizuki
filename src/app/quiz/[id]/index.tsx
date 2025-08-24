import QuestionCard from "@/components/QuestionCard";
import { useRepositoryStore } from "@/store/useRepositoryStore";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { setStringAsync } from 'expo-clipboard';
import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Linking, NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { AnimatedFAB, IconButton, Menu, Text } from "react-native-paper";

const PreviewScreen = () => {
    const { id } = useLocalSearchParams();
    const quizRepo = useRepositoryStore(v => v.quiz!)
    const [scrollY, setScrollY] = useState(0);


    const {
        data: quiz,
        error,
        updatedAt
    } = useLiveQuery(
        quizRepo.getQuizData(Number.parseInt(id as string))
    )

    if(!updatedAt) {
        return <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size="large" />
        </View>
    }

    if(error) {
        return <View style={{flex: 1}}>
            <Text>Error</Text>
            <Text>{error.message}</Text>
        </View>
    }

    if(!quiz) {
        return <Text>Quiz not found.</Text>
    }


    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        setScrollY(event.nativeEvent.contentOffset.y);
    };



    const HeaderMenu = () => {
        const [visible, setVisible] = useState(false);
        const url = `https://wayground.com/join/quiz/${quiz.onlineId}/start`;
        const handleCopy = async () => {
            setVisible(false);
            await setStringAsync(url)
        };
        const handleOpen = async () => {
            await Linking.openURL(url);   
        }
        return (
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={<IconButton icon="dots-vertical" onPress={() => setVisible(true)} />}
            >
                <Menu.Item onPress={handleCopy} title="Copy Link" />
                <Menu.Item onPress={handleOpen} title="Open in Browser" />
            </Menu>
        );
    };

    function handleFabPress() {
        router.replace({
            pathname: '/quiz/[id]/pregame',
            params: {
                id: id as string
            }
        })
    }


    return (
        <>
            <Stack.Screen
                options={{
                    headerRight: () => <HeaderMenu/>
                }}
            />
            <FlatList
                data={quiz.questions}
                onScroll={handleScroll}
                keyExtractor={(item) => item.onlineId}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 32 }}
                ListHeaderComponent={<View style={{ gap: 8 }}>
                    {quiz.image && (
                        <Image
                            source={{ uri: quiz.image }}
                            style={{ width: '100%', height: 200 }}
                            contentFit="cover"
                        />
                    )}
                    <Text variant="titleLarge">{quiz.name}</Text>
                    {/*<Text variant="bodySmall">{quiz.createdBy}</Text>*/}
                    <Text variant="titleMedium">Questions</Text>
                </View>}
                renderItem={({ item,index }) => <QuestionCard question={item} index={index} />}
            />
            <AnimatedFAB
                label={'Start'}
                extended={scrollY <= 80}
                icon="play"
                style={{ position: 'absolute', bottom: 16, right: 16 }}
                onPress={handleFabPress}
            />
        </>
    );
};


export default PreviewScreen;