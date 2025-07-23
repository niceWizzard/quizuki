import { Stack } from "expo-router";
import DrizzleProvider from "@/providers/DrizzleProvider";

export default function RootLayout() {
  return <DrizzleProvider>
    <Stack />
  </DrizzleProvider>;
}
