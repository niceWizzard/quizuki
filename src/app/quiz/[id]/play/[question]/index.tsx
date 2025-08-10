import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

const PlayIndexScreen = () => {
      const { id, question } = useLocalSearchParams();
  
  return (
    <View>
      <Text>PlayIndexScreen {id + " ::: " +  question }</Text>
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