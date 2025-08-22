import {Stack, Tabs} from "expo-router";
import {useEffect} from "react";
import {useRepositoryStore} from "@/store/useRepositoryStore";


export default function PlayQuestionLayout() {

    const playRepo = useRepositoryStore(v => v.play!);

    useEffect(() => {
        return () => {
            playRepo.clearPlay();
        }
    }, [playRepo]);
  return <Stack>
      <Stack.Screen
          name="[question]/index"
          options={{
              headerShown: false,
          }}
      />
  </Stack>;
}