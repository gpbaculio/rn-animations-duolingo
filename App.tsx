import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Duolingo from "./src";

export default function App() {
  return (
    <SafeAreaProvider>
      <Duolingo />
    </SafeAreaProvider>
  );
}
