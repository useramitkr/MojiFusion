import { useGame } from "@/context/GameContext";
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Dashboard() {
  const { theme, setTheme } = useGame();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>Current Theme: {theme}</Text>
      <Button title="Switch to Fruits" onPress={() => setTheme("fruits")} />
      <Button title="Switch to Faces" onPress={() => setTheme("faces")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, marginBottom: 20 },
});
