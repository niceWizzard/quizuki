import React, {useState} from 'react';
import {ActivityIndicator, FlatList, NativeScrollEvent, NativeSyntheticEvent, View} from "react-native";
import {AnimatedFAB, IconButton, Menu, Text} from "react-native-paper";
import {Stack, useLocalSearchParams} from "expo-router";
import {Image} from "expo-image";
import QuestionCard from "@/components/QuestionCard";
import {useLiveQuery} from "drizzle-orm/expo-sqlite";
import {useRepositoryStore} from "@/store/useRepositoryStore";

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

        const handleRefresh = async () => {
            setVisible(false);

        };
        return (
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={<IconButton icon="dots-vertical" onPress={() => setVisible(true)} />}
            >
                <Menu.Item onPress={handleRefresh} title="Refresh" />
            </Menu>
        );
    };


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
                icon="content-save-outline"
                style={{ position: 'absolute', bottom: 16, right: 16 }}
                onPress={() => {}}
            />
        </>
    );
};


export default PreviewScreen;