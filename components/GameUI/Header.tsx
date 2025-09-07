// file: components/GameUI/Header.tsx
import { useGame } from "@/context/GameContext";
import { themes } from "@/game/themes";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";

export default function Header() {
  const { score, bestScore, bestTile, newGame, theme, switcherCount, soundEnabled, toggleSound, useSwitcher } = useGame();
  const [showInstructions, setShowInstructions] = useState(false);
  
  const bestTileEmoji = themes[theme][bestTile] || "❓";

  return (
    <>
      <View style={styles.header}>
        {/* Top Row - Title and Controls */}
        <View style={styles.topRow}>
          <Text style={styles.title}>MojiFusion</Text>
          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.controlBtn}
              onPress={() => setShowInstructions(true)}
            >
              <Text style={styles.controlIcon}>❓</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.controlBtn}
              onPress={toggleSound}
            >
              <Text style={styles.controlIcon}>{soundEnabled ? '🔊' : '🔇'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{score.toLocaleString()}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Best</Text>
            <Text style={styles.statValue}>{bestScore.toLocaleString()}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Best Item</Text>
            <Text style={styles.statEmoji}>{bestTileEmoji}</Text>
          </View>
        </View>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, switcherCount > 0 && styles.activeBtn]}
            onPress={useSwitcher}
            disabled={switcherCount <= 0}
          >
            <Text style={styles.actionText}>⏳ {switcherCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={newGame} style={styles.newGameBtn}>
            <Text style={styles.newGameText}>🐰 New Game</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Next switcher: {1000 - (score % 1000)} points
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${(score % 1000) / 10}%` }]} 
            />
          </View>
        </View>
      </View>

      {/* Instructions Modal */}
      <Modal
        visible={showInstructions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInstructions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowInstructions(false)}
        >
          <View style={styles.instructionsModal}>
            <Text style={styles.modalTitle}>🎮 How to Play</Text>
            
            <View style={styles.instructionItem}>
              <Text style={styles.instructionIcon}>⬅️➡️⬆️⬇️</Text>
              <Text style={styles.instructionText}>Swipe to move tiles</Text>
            </View>
            
            <View style={styles.instructionItem}>
              <Text style={styles.instructionIcon}>🍎 + 🍎 = 🍌</Text>
              <Text style={styles.instructionText}>Merge same items to evolve</Text>
            </View>
            
            <View style={styles.instructionItem}>
              <Text style={styles.instructionIcon}>🔄</Text>
              <Text style={styles.instructionText}>Click the switcher to clear half the board and reset the rest to the starting tile.</Text>
            </View>
            
            <View style={styles.instructionItem}>
              <Text style={styles.instructionIcon}>🎯</Text>
              <Text style={styles.instructionText}>Goal: Get highest score and unlock themes!</Text>
            </View>

            <TouchableOpacity 
              style={styles.closeBtn}
              onPress={() => setShowInstructions(false)}
            >
              <Text style={styles.closeBtnText}>Got it! 🎉</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "95%",
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FF6B35",
  },
  controls: {
    flexDirection: "row",
    gap: 8,
  },
  controlBtn: {
    width: 32,
    height: 32,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  controlIcon: {
    fontSize: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333",
  },
  statEmoji: {
    fontSize: 18,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    alignItems: "center",
  },
  activeBtn: {
    backgroundColor: "#4CAF50",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffffff",
  },
  newGameBtn: {
    flex: 2,
    paddingVertical: 10,
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    alignItems: "center",
  },
  newGameText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  progressContainer: {
    alignItems: "center",
  },
  progressText: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  instructionsModal: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    margin: 20,
    elevation: 10,
    width: "85%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  instructionIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 40,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  closeBtn: {
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  closeBtnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});