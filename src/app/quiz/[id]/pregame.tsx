import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

const PregameScreen = () => {
    const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>PregameScreen {id}</Text>
      <Button onPress={() => router.replace({
        pathname: '/quiz/[id]/play/[question]',
        params: {
          id : id as string,
          question: 0,
        }
      })}>Play</Button>
    </View>
  )
}

export default PregameScreen;