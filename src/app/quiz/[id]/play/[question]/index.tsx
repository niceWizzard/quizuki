import { useRepositoryStore } from '@/store/useRepositoryStore';
import { Question } from '@/types/db';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

const PlayIndexScreen = () => {
  const { id, question } = useLocalSearchParams();
  const quizId =  Number.parseInt(id as string);
  const questionIndex =  Number.parseInt(question as string);

  const playRepo = useRepositoryStore(v => v.play!);
  const [data, setData] = useState<Question|undefined>()      
  
  useEffect(() => {
    async function something() {
      const d = await playRepo.getPlayQuestion(Number.parseInt(id as string), Number.parseInt(question as string))
      setData(d )
    }
    something();
  }, [playRepo, id, question])


  if(!data) {
    return <Text>Loading</Text>
  }

  return (
    <View>
      <Text>PlayIndexScreen {id + " ::: " +  question }</Text>
      <Text>{data.text}</Text>
      <Button onPress={() => router.replace({
        pathname: '/quiz/[id]/play/[question]',
        params: {
          id : id as string,
          question: Number.parseInt(question as string) + 1,
        }
      })}>Next</Button>
    </View>
  )
}

export default PlayIndexScreen