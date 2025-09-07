import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  title: string;
  unlocked: boolean;
  requiredScore?: number;
  onSelect?: () => void;
  isSelected?: boolean;
};

export default function ThemeCard({ title, unlocked, requiredScore, onSelect, isSelected }: Props) {
  const getGradientColors = () => {
    if (!unlocked) return ['#E0E0E0', '#BDBDBD'];
    if (isSelected) return ['#4ECDC4', '#44A08D'];
    return ['#667eea', '#764ba2'];
  };

  return (
    <TouchableOpacity
      onPress={unlocked ? onSelect : undefined}
      style={styles.cardContainer}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={[styles.card, !unlocked && styles.locked]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[styles.title, { color: unlocked ? '#fff' : '#666' }]}>
          {title}
        </Text>
        {!unlocked && (
          <Text style={styles.lockText}>
            Unlock at {requiredScore?.toLocaleString()} points
          </Text>
        )}
        {isSelected && unlocked && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedText}>✓ Active</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "85%",
    marginVertical: 8,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  locked: {
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  lockText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    fontWeight: "500",
  },
  selectedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  selectedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});