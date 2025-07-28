import React, {useRef, useState} from 'react';
import {ActivityIndicator, FlatList, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View} from "react-native";
import {AnimatedFAB, Button, Card, FAB, Text, useTheme} from "react-native-paper";
import {router, useLocalSearchParams} from "expo-router";
import {useQuery} from "@tanstack/react-query";
import {Image} from "expo-image";
import {ApiQuizSchema, QuizSchema} from "@/utils/fetchSchema";
import {useDrizzleStore} from "@/store/useDrizzleStore";
import {quizTable} from "@/db/schema";
import QuestionCard from "@/components/QuestionCard";

const PreviewScreen = () => {
    const { id } = useLocalSearchParams();
    const drizzle = useDrizzleStore(v => v.drizzle!);
    const [scrollY, setScrollY] = useState(0);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['preview', id],
        queryFn: async () => {
            const res = await fetch('https://wayground.com/quiz/' + id, { method: 'GET' });
            setFetchStatus('Fetching...');
            const apiData = await res.json();

            if (!apiData.success) {
                throw new Error(apiData.message);
            }

            setFetchStatus('Parsing...');
            const data = await QuizSchema.parseAsync(apiData.data.quiz);
            if (!data) throw new Error('Unable to parse.');

            return data;
        },
    });

    if (error) return <ErrorView message={error.message} onRetry={refetch} />;
    if (isLoading) return <LoadingView status={fetchStatus} />;

    const quiz = data!;

    const saveQuizToDb = async () => {
        await drizzle.insert(quizTable).values({
            name: quiz.name,
            waygroundId: quiz.id,
        });
        router.back();
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        setScrollY(event.nativeEvent.contentOffset.y);
    };

    return (
        <>
            <FlatList
                data={quiz.questions}
                onScroll={handleScroll}
                keyExtractor={(item) => item._id}
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
                    <Text variant="bodySmall">{quiz.createdBy}</Text>
                    <Text variant="titleMedium">Questions</Text>
                </View>}
                renderItem={({ item }) => <QuestionCard question={item} />}
            />
            <AnimatedFAB
                label={'Save Quiz'}
                extended={scrollY <= 80}
                icon="content-save-outline"
                style={{ position: 'absolute', bottom: 16, right: 16 }}
                onPress={saveQuizToDb}
            />
        </>
    );
};


const LoadingView = ({ status }: { status: string }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            <Text>{status}</Text>
        </View>
    );
};

const ErrorView = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.error }}>
                Something went wrong: {message}
            </Text>
            <Button onPress={onRetry}>Retry</Button>
        </View>
    );
};

export default PreviewScreen;