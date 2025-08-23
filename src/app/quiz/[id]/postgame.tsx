import {View} from "react-native";
import {useRepositoryStore} from "@/store/useRepositoryStore";
import {Button, Text} from "react-native-paper";
import {useEffect} from "react";
import {router, useNavigation} from "expo-router";

export default function PostGameScreen() {

    const playRepo = useRepositoryStore(v => v.play!);
    const activePlay = playRepo.activePlay!;
    const navigation = useNavigation();

    useEffect(() => {
        return navigation.addListener('beforeRemove', (e) => {
            playRepo.clearPlay()
        })
    }, [playRepo, navigation]);

    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{activePlay.quiz.name}</Text>
        <Button onPress={() => router.replace({
            pathname: '/quiz/[id]/pregame',
            params: {
                id: activePlay.quiz.id,
            }
        })}>Restart</Button>
    </View>
}