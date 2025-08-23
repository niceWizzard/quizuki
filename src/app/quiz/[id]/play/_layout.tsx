import {Stack, useNavigation} from "expo-router";
import {useEffect} from "react";
import {useRepositoryStore} from "@/store/useRepositoryStore";
import {Alert} from "react-native";


export default function PlayQuestionLayout() {

    const playRepo = useRepositoryStore(v => v.play!);
    const navigation = useNavigation();

    useEffect(() => {
        return navigation.addListener('beforeRemove', (e) => {
            if(e.data.action.type === 'POP') {
                e.preventDefault();
                Alert.alert(
                    'Quiz playing?',
                    'Your session will be saved.',
                    [
                        {
                            text: "Cancel", style: 'cancel', onPress: () => {
                            }
                        },
                        {
                            text: 'Leave',
                            style: 'destructive',
                            onPress: () => {
                                playRepo.clearPlay();
                                navigation.dispatch(e.data.action);
                            },
                        },
                    ]
                );
            }
        });
    }, [navigation, playRepo]);
  return <Stack>
      <Stack.Screen
          name="[question]/index"
          options={{
              headerShown: false,
          }}
      />
  </Stack>;
}