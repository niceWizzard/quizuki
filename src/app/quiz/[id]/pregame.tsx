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
    return router.replace({
      pathname: '/quiz/[id]/play/[question]',
      params: {
        id: id as string,
        question: 0,
      }
    });
  }

  const playInfo = data;

  if(error) {
    return <View>
      <Text>{error.message}</Text>
    </View>
  }

  if(!playInfo) {
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
      <Text>PregameScreen {playInfo?.name}</Text>
      <Button onPress={handleOnPlay}>Play</Button>
    </View>
  )


}

export default PregameScreen;