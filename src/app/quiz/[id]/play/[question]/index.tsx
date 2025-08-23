import { useRepositoryStore } from '@/store/useRepositoryStore';
import {Play, Question, WholeQuestion} from '@/types/db';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Button, Card, Text, TextInput, useTheme} from 'react-native-paper';
import {Image} from "expo-image";
import {QuestionType} from "@/db/question";
import RenderHTML from "react-native-render-html";




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


  if(!data) {
    return <Text>Loading</Text>
  }

  return (
      <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingVertical: 24,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            flexGrow: 1,
          }}>
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

interface QuestionDisplayProps {
  questionIndex: number,
  activePlay: Play,
  question: WholeQuestion,
  hasNextQuestion: boolean,
  quizId: number
}

function QuestionDisplay({
         question,
         activePlay,
         questionIndex,
         quizId,
         hasNextQuestion,
       } : QuestionDisplayProps) {

  const {colors, fonts} = useTheme()
  return <>
    <Card style={{width: '100%'}}>
      <Card.Content style={{gap: 16}}>
        <Text variant="bodySmall" style={{textAlign: 'center'}}>
          {questionIndex + 1} out of {activePlay.questionOrder.length}
        </Text>
        <RenderHTML
            source={{html: question.text}}
            defaultTextProps={{
              style: {
                color: colors.onBackground,
                fontWeight: fonts.bodyMedium.fontWeight,
                fontSize: fonts.bodyMedium.fontSize,
                lineHeight: fonts.bodyMedium.lineHeight,
              }
            }}
        />
        {question.images.map((path) => (<Image
            key={path}
            source={{uri: path}}
            style={{width: '100%', minHeight: 256, height: 'auto'}}
            contentFit={'contain'}
        />))}
      </Card.Content>
    </Card>
    <QuestionAnswerField
        hasNextQuestion={hasNextQuestion}
        questionIndex={questionIndex}
        quizId={quizId}
        question={question}
    />
  </>;
}



interface QuestionAnswerFieldProps {
  quizId: number,
  questionIndex: number ,
  hasNextQuestion: boolean,
  question: WholeQuestion
}

function QuestionAnswerField({hasNextQuestion,questionIndex,quizId, question}: QuestionAnswerFieldProps ) {

  const {colors, fonts} = useTheme()

  function navigateToNext() {
    if(hasNextQuestion) {
      router.replace({
        pathname: '/quiz/[id]/play/[question]',
        params: {
          id: quizId,
          question: questionIndex + 1,
        }
      })
    } else {
      alert("No next question")
    }
  }

  if(question.type === QuestionType.Blank) {
    return <View
        style={{ width: "100%", gap: 8}}
    >
      <TextInput
          placeholder="Your answer"
      />
      <Button onPress={navigateToNext}>
        Submit
      </Button>
    </View>
  }

  if(question.type === QuestionType.MC || question.type === QuestionType.MS) {
    return <View style={{width: '100%', flexGrow: 0, justifyContent: 'center',
      gap: 8,}}
    >
      {
        question.options.map((option, i) => (
            <TouchableOpacity
              key={`option-${option.id}`}
              style={{
                padding: 16,
                borderRadius: 8,
                backgroundColor: colors.elevation.level2,
              }}
              onPress={() => {
                navigateToNext()
              }}
            >
              {
                option.text ? (
                    <RenderHTML source={{html: option.text}}
                        defaultTextProps={{
                          style: {
                            color: colors.onBackground,
                            fontWeight: fonts.bodyMedium.fontWeight,
                            fontSize: fonts.bodyMedium.fontSize,
                            lineHeight: fonts.bodyMedium.lineHeight,
                          }
                        }}
                    />
                ) : null
              }
              {
                option.images.map((image, i) => (
                    <Image
                      source={{uri: image}}
                      key={`option-${option.id}-image-${image}`}
                      style={{width: '100%', minHeight: 96, height: 'auto', marginTop: 8}}
                      contentFit={'contain'}
                    />
                ))
              }
            </TouchableOpacity>
        ))
      }
    </View>
  }

  return null;
}


export default PlayIndexScreen