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
      </Stack>
    </DrizzleProvider>
  </ReactNativePaperProvider>;
}
