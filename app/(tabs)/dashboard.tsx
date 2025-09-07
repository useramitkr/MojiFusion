import { useGame } from "@/context/GameContext";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ThemeCard from "@/components/GameUI/ThemeCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const THEME_DATA = [
  { id: "fruits", title: "Fruits", requiredScore: 0 },
  { id: "faces", title: "Faces", requiredScore: 5000 },
];

export default function Dashboard() {
  const { theme, setTheme, score } = useGame();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title} type="title">Change Theme</ThemedText>
      <View style={styles.cardContainer}>
        {THEME_DATA.map((themeData) => (
          <ThemeCard
            key={themeData.id}
            title={themeData.title}
            unlocked={score >= themeData.requiredScore}
            requiredScore={themeData.requiredScore}
            onSelect={() => setTheme(themeData.id)}
            isSelected={theme === themeData.id}
          />
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",
  },
  title: { 
    fontSize: 28, 
    marginBottom: 20,
    color: '#333'
  },
  cardContainer: {
    width: "100%",
    alignItems: "center",
  },
});