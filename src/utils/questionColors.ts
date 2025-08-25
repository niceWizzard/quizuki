import {MD3Colors} from "react-native-paper/lib/typescript/types";

export enum QuestionState {
    Answering,
    Correct,
    Incorrect,
}


export function getTextColor(state : QuestionState, colors: MD3Colors) {
    switch (state) {
        case QuestionState.Incorrect:
            return "red";
        case QuestionState.Correct:
            return "green";
    }
    return colors.onBackground;
}

export function getOptionBgColor(
    state : QuestionState,
    colors : MD3Colors,
    selected: boolean,
    isCorrectAnswer: boolean,
) {
    if(isCorrectAnswer && state !== QuestionState.Answering) {
        return "green";
    }
    if(selected) {
        return getTextColor(state, colors);
    }
    return colors.elevation.level2;
}

export function getOptionTextColor(state : QuestionState, colors : MD3Colors, selected: boolean) {
    if(selected) {
        switch (state) {
            case QuestionState.Correct:
                return "white";
            case QuestionState.Incorrect:
                return "black"
        }
    }
    return colors.onBackground;
}


