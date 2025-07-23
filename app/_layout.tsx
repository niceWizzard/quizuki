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
      </Stack>
    </DrizzleProvider>
  </ReactNativePaperProvider>;
}
