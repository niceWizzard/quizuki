import { useRepositoryStore } from '@/store/useRepositoryStore';
import {WholeQuestion} from '@/types/db';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {Keyboard, Platform, ScrollView} from 'react-native';
import {Text} from 'react-native-paper';
import QuestionDisplay from "@/components/quiz/play/QuestionDisplay";




const PlayIndexScreen = () => {
  const { id, question } = useLocalSearchParams();
  const quizId =  Number.parseInt(id as string);
  const questionIndex =  Number.parseInt(question as string);

  const playRepo = useRepositoryStore(v => v.play!);
  const activePlay = playRepo.activePlay!;
  const [data, setData] = useState<WholeQuestion|undefined>()

  const hasNextQuestion = questionIndex < activePlay.questionOrder.length - 1;

  useEffect(() => {
    async function something() {
      const d = await playRepo.getPlayQuestion(Number.parseInt(id as string), Number.parseInt(question as string))
      setData(d )
    }
    something();
  }, [playRepo, id, question])

    const [keyboardOffset, setKeyboardOffset] = useState(0);
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardOffset(e.endCoordinates.height);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardOffset(0);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

  if(!data) {
    return <Text>Loading</Text>
  }

  return (
      <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 24,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            flexGrow: 1,
            marginBottom: keyboardOffset,
          }}
      >
        <QuestionDisplay
            question={data}
            questionIndex={questionIndex}
            quizId={quizId}
            activePlay={activePlay}
            hasNextQuestion={hasNextQuestion}
        />
      </ScrollView>
  )
}




export default PlayIndexScreen