import { useColorScheme } from 'react-native';
import {
    MD3DarkTheme,
    MD3LightTheme,
    PaperProvider,
    adaptNavigationTheme, useTheme,
} from "react-native-paper";
import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";

import merge from "deepmerge";
import {PropsWithChildren, useEffect} from "react";
import {setBackgroundColorAsync} from 'expo-system-ui'

const customDarkTheme = { ...MD3DarkTheme};
const customLightTheme = { ...MD3LightTheme,  };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});


const CombinedLightTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

export default function ReactNativePaperProvider({children} : PropsWithChildren) {
    const colorScheme = useColorScheme();

    const paperTheme =
        colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;

    return (
        <PaperProvider theme={paperTheme}>
            <ThemeProvider value={paperTheme}>
                    <SystemUIChanger>
                        {children}
                    </SystemUIChanger>
            </ThemeProvider>
        </PaperProvider>
    )
}

function SystemUIChanger({children}: PropsWithChildren) {
    const {colors} = useTheme();
    useEffect(() => {
        setBackgroundColorAsync(colors.background);
    }, [colors]);
    return <>
        {children}
    </>
}