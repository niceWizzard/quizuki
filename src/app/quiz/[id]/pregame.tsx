import { useRepositoryStore } from '@/store/useRepositoryStore';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

const PregameScreen = () => {
    const { id } = useLocalSearchParams();
    const quizId = Number.parseInt(id as string);
    const quizRepo = useRepositoryStore(v => v.quiz!);
    const playRepo = useRepositoryStore(v => v.play!);

    const {data, error} = useLiveQuery(quizRepo.getQuizData(quizId));

  async function handleOnPlay(){
    await playRepo.createPlay(quizId)
    router.replace({
      pathname: '/quiz/[id]/play/[question]',
      params: {
        id: id as string,
        question: 0,
      }
    });
  }

  async function handleOnContinue() {
      const play = await playRepo.activatePlay(quizId);
      router.replace({
          pathname: '/quiz/[id]/play/[question]',
          params: {
              id: id as string,
              question: play.responses.length,
          }
      });
  }

  const quizInfo = data;

  if(error) {
    return <View>
      <Text>{error.message}</Text>
    </View>
  }

  if(!quizInfo) {
    return <View style={{flex: 1}}>
      <Text>Not found</Text>
    </View>
  }

  return (
    <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }}>
      <Text variant="bodyLarge">{quizInfo?.name}</Text>
        {
            quizInfo.play ? (
                <View style={{gap: 16, marginTop: 32,}}>
                    <Text variant="bodySmall">Existing session has been detected.</Text>
                    <Button mode="contained-tonal" onPress={handleOnContinue}>Continue?</Button>
                    <Button onPress={handleOnPlay}>Create a new one</Button>
                </View>
            ) : (
                <Button onPress={handleOnPlay}>Play</Button>
            )
        }
    </View>
  )


}

export default PregameScreen;