import { Stack } from "expo-router";
import DrizzleProvider from "@/providers/DrizzleProvider";
import ReactNativePaperProvider from "@/providers/ReactNativePaperProvider";

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
          }}
        />
      </Stack>
    </DrizzleProvider>
  </ReactNativePaperProvider>;
}
