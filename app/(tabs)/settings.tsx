// app/(tabs)/settings.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useGame } from "@/context/GameContext";
import Legal from "@/components/GameUI/legal";

export default function SettingsScreen() {
  const { 
    soundEnabled, 
    musicEnabled, 
    coins, 
    bestScore, 
    switcherCount, 
    toggleSound, 
    toggleMusic,
    restartGame 
  } = useGame();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Settings</Text>
        <Text style={styles.subtitle}>Customize your game experience</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Game Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🏆</Text>
              <Text style={styles.statLabel}>Best Score</Text>
              <Text style={styles.statValue}>{bestScore.toLocaleString()}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🪙</Text>
              <Text style={styles.statLabel}>Coins</Text>
              <Text style={styles.statValue}>{coins.toLocaleString()}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>⏳</Text>
              <Text style={styles.statLabel}>Switchers</Text>
              <Text style={styles.statValue}>{switcherCount}</Text>
            </View>
          </View>
        </View>

        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔊 Audio Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>🎵 Background Music</Text>
              <Text style={styles.settingDescription}>Play ambient music while gaming</Text>
            </View>
            <Switch
              value={musicEnabled}
              onValueChange={toggleMusic}
              trackColor={{ false: "#e0e0e0", true: "#4CAF50" }}
              thumbColor={musicEnabled ? "#fff" : "#f4f3f4"}
              ios_backgroundColor="#e0e0e0"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>🔔 Sound Effects</Text>
              <Text style={styles.settingDescription}>Play sounds for moves and merges</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: "#e0e0e0", true: "#4CAF50" }}
              thumbColor={soundEnabled ? "#fff" : "#f4f3f4"}
              ios_backgroundColor="#e0e0e0"
            />
          </View>
        </View>

        {/* Game Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎮 Game Controls</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={restartGame}>
            <Text style={styles.actionButtonEmoji}>🔄</Text>
            <View style={styles.actionButtonText}>
              <Text style={styles.actionButtonTitle}>New Game</Text>
              <Text style={styles.actionButtonDesc}>Start a fresh game</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 How to Play</Text>
          
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>🎯 Basic Gameplay</Text>
            <Text style={styles.instructionText}>• Swipe to move tiles in any direction</Text>
            <Text style={styles.instructionText}>• Combine identical emojis to evolve them</Text>
            <Text style={styles.instructionText}>• Reach higher scores to unlock new themes</Text>
          </View>

          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>✨ Special Features</Text>
            <Text style={styles.instructionText}>• 💣 Bomb: Clears surrounding tiles</Text>
            <Text style={styles.instructionText}>• 🪙 Coin: Adds 100 bonus points</Text>
            <Text style={styles.instructionText}>• 🎁 Reward: Gives extra switchers</Text>
            <Text style={styles.instructionText}>• ⏳ Switcher: Reset half the board</Text>
          </View>

          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>🏅 Rewards System</Text>
            <Text style={styles.instructionText}>• Earn coins from your score (1 coin per 10 points)</Text>
            <Text style={styles.instructionText}>• Get switchers every 1000 points</Text>
            <Text style={styles.instructionText}>• Use coins to unlock premium themes</Text>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 Legal</Text>
          <Legal />
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FF6B35",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    textAlign: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FF6B35",
    marginTop: 4,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  actionButtonText: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  actionButtonDesc: {
    fontSize: 14,
    color: "#666",
  },
  instructionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B35",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 4,
  },
});