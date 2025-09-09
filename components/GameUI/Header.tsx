// Enhanced Header.tsx with new layout
import { useGame } from "@/context/GameContext";
import { themes } from "@/game/themes";
import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Animated,
  Dimensions 
} from "react-native";

const { width } = Dimensions.get('window');

export default function Header() {
  const { 
    score, 
    bestScore, 
    bestTile, 
    newGame, 
    theme, 
    switcherCount, 
    coins,
    useSwitcher
  } = useGame();
  
  const [showInstructions, setShowInstructions] = useState(false);
  
  const bestTileEmoji = themes[theme][bestTile] || "❓";
  
  const coinPulse = useRef(new Animated.Value(1)).current;

  // Coin pulse animation
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(coinPulse, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(coinPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    
    return () => pulseAnimation.stop();
  }, [coinPulse]);

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
              style={[
                styles.actionBtn, 
                switcherCount > 0 && styles.activeBtn
              ]}
              onPress={useSwitcher}
              disabled={switcherCount <= 0}
            >
              <Text style={styles.actionText}>🔑 {switcherCount}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={newGame}>
              <Text style={styles.newGameText}>New Game</Text>
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
          <Animated.View 
            style={[
              styles.statBox,
              { transform: [{ scale: coinPulse }] },
              { backgroundColor: "#ffffff" }
            ]}
          >
            <Text style={styles.statLabel}>Coins</Text>
            <View style={styles.coinDisplay}>
              <Text style={styles.coinEmoji}>🪙</Text>
              <Text style={styles.statValue}>{coins}</Text>
            </View>
          </Animated.View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Best Item</Text>
            <Text style={styles.statEmoji}>{bestTileEmoji}</Text>
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
                <Text style={styles.instructionIcon}>💣🪙🎁</Text>
                <Text style={styles.instructionText}>Special tiles have amazing effects!</Text>
              </View>
              
              <View style={styles.instructionItem}>
                <Text style={styles.instructionIcon}>⏳</Text>
                <Text style={styles.instructionText}>Switcher clears half the board</Text>
              </View>
              
              <View style={styles.instructionItem}>
                <Text style={styles.instructionIcon}>🪙</Text>
                <Text style={styles.instructionText}>Earn coins to unlock premium themes</Text>
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "95%",
    marginTop: 10,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
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
    color: "#ffdd35ff",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
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
    gap: 4,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f8f8f8ff",
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#333",
  },
  statEmoji: {
    fontSize: 16,
  },
  coinDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  coinEmoji: {
    fontSize: 12,
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    // backgroundColor: "#e0e0e0",
    borderRadius: 12,
    alignItems: "center",
  },
  activeBtn: {
    // backgroundColor: "#4CAF50",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
  },
  newGameText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffdd35ff",
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
    fontSize: 18,
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
