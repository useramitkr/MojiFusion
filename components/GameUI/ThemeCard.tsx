// components/ThemeCard.tsx
import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  unlocked: boolean;
  requiredScore?: number;
  onSelect?: () => void;
};

export default function ThemeCard({ title, unlocked, requiredScore, onSelect }: Props) {
  return (
    <TouchableOpacity
      onPress={unlocked ? onSelect : undefined}
      style={[styles.card, !unlocked && styles.locked]}
    >
      <Text style={styles.title}>{title}</Text>
      {!unlocked && (
        <Text style={styles.lockText}>Unlock at {requiredScore} points</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "80%",
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    backgroundColor: "#fff",
    elevation: 3,
    alignItems: "center",
  },
  locked: {
    backgroundColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lockText: {
    fontSize: 14,
    color: "#555",
  },
});
