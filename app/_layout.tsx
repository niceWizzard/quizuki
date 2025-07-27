import DrizzleProvider from "@/providers/DrizzleProvider";
import ReactNativePaperProvider from "@/providers/ReactNativePaperProvider";
import { Stack } from "expo-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return <ReactNativePaperProvider>
    <DrizzleProvider>
      <QueryClientProvider client={queryClient}>
          <Stack>
              <Stack.Screen
                  name="(tabs)"
                  options={{
                      headerShown: false,
                  }}
              />
              <Stack.Screen
                  name="quiz/[id]/preview"
                  options={{
                      headerTitle: "Preview Screen",
                      animation: 'fade_from_bottom',
                  }}

              />
          </Stack>
      </QueryClientProvider>
    </DrizzleProvider>
  </ReactNativePaperProvider>;
}
