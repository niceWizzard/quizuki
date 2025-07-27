import DrizzleProvider from "@/providers/DrizzleProvider";
import ReactNativePaperProvider from "@/providers/ReactNativePaperProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return <ReactNativePaperProvider>
    <DrizzleProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="quiz/create"
          options={{
            headerTitle: "Create Quiz",
            animation: 'fade_from_bottom',
          }}
        />
      </Stack>
    </DrizzleProvider>
  </ReactNativePaperProvider>;
}
