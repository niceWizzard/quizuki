import { useRepositoryStore } from '@/store/useRepositoryStore';
import {Play,  WholeQuestion} from '@/types/db';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {Keyboard, Platform, ScrollView, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {Button, Card, Text, TextInput, useTheme} from 'react-native-paper';
import {Image} from "expo-image";
import {QuestionType} from "@/db/question";
import RenderHTML from "react-native-render-html";
import {Controller, useForm} from "react-hook-form";




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

    const {width} = useWindowDimensions();
    const {colors, fonts} = useTheme()

    function onQuestionAnswered(a : number[] | string) {
        if(question.type === QuestionType.Blank) {
            const answer = a as string;
            const isCorrect = question.answerBlank!
                .replaceAll("/<[^>]*>/g", "")
                .toLowerCase() === answer.toLowerCase()
            alert(isCorrect);
        } else if (question.type === QuestionType.MC) {

        }
        if(hasNextQuestion) {
            router.replace({
                pathname: '/quiz/[id]/play/[question]',
                params: {
                    id: quizId,
                    question: questionIndex + 1,
                }
            })
        } else {
            router.replace({
                pathname: '/quiz/[id]/postgame',
                params: {
                    id: quizId,
                }
            })
        }
    }

    return <>
    <Card style={{width: '100%'}}>
      <Card.Content style={{gap: 16}}>
        <Text variant="bodySmall" style={{textAlign: 'center'}}>
          {questionIndex + 1} out of {activePlay.questionOrder.length}
        </Text>
        <RenderHTML
            source={{html: question.text}}
            contentWidth={width}
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
        question={question}
        onAnswer={onQuestionAnswered}
    />
  </>;
}


function IdentificationField ({onAnswer} : {onAnswer: (answer: string) => void}) {
    const {
        control,
        handleSubmit,
    } = useForm<{answer: string}>({
        defaultValues: {
            answer: '',
        }
    })

    function handleAnswerSubmit(form: {answer: string}) {
        onAnswer(form.answer)
    }

    return <View
        style={{ width: "100%", gap: 8}}
    >
        <Controller
            name="answer"
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                    label="Your Answer"
                    mode="flat"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={text => onChange(text)}
                    onSubmitEditing={handleSubmit(handleAnswerSubmit)}
                    autoFocus
                />
            )}
        />
        <Button onPress={handleSubmit(handleAnswerSubmit)}>
            Submit
        </Button>
    </View>
}

interface QuestionAnswerFieldProps {
    question: WholeQuestion,
    onAnswer: (a : number[] | string) => void,
}

function QuestionAnswerField(
    {
        question,
        onAnswer,

    }: QuestionAnswerFieldProps ) {

  const {colors, fonts} = useTheme()
    const {width} = useWindowDimensions();


  if(question.type === QuestionType.Blank) {
    return <IdentificationField onAnswer={onAnswer} />
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
                  onAnswer([option.id])
              }}
            >
              {
                option.text ? (
                    <RenderHTML
                        source={{html: option.text}}
                        contentWidth={width}
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