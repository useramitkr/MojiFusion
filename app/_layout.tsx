import { GameProvider } from "@/context/GameContext";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import mobileAds from 'react-native-google-mobile-ads';

export default function RootLayout() {

  // Initialize Google Mobile Ads SDK
  // useEffect(() => {
  //   (async () => {
  //     await mobileAds().initialize();
  //   })();
  // }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </GameProvider>
    </GestureHandlerRootView>
  );
}