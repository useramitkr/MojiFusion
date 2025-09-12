// Enhanced Header.tsx with new layout
import { useGame } from "@/context/GameContext";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Easing
} from "react-native";
import InlineAd from "../AdmobAd/InlineAd";

const { width } = Dimensions.get('window');

export default function Header() {
  const {
    score,
    bestScore,
    newGame,
    switcherCount,
    coins,
    useSwitcher,
    level,
    progress,
    nextLevelScore
  } = useGame();

  const [showInstructions, setShowInstructions] = useState(false);

  const coinPulse = useRef(new Animated.Value(1)).current;
  const switcherPop = useRef(new Animated.Value(1)).current;
  const prevSwitcherCount = useRef(switcherCount);
  const progressAnim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(coinPulse, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(coinPulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, [coinPulse]);

  useEffect(() => {
    if (switcherCount > prevSwitcherCount.current) {
      Animated.sequence([
        Animated.timing(switcherPop, { toValue: 1.2, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.spring(switcherPop, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
      ]).start();
    }
    prevSwitcherCount.current = switcherCount;
  }, [switcherCount]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, nextLevelScore],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Text style={styles.title}>MojiFusion</Text>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlBtn} onPress={() => setShowInstructions(true)}>
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
              <Animated.View style={{ transform: [{ scale: switcherPop }], backgroundColor: switcherCount > 0 ? "#FF6B35" : "#ccc", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={styles.actionText}>🔑 {switcherCount}</Text>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity onPress={newGame}>
              <Text style={styles.newGameText}>New Game</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Game Level and Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, styles.levelStatBox]}>
            <Text style={styles.levelText}>Level {level}</Text>
            <View style={styles.progressBarContainer}>
              <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>
            <Text style={styles.progressText}>{progress.toLocaleString()}/{nextLevelScore.toLocaleString()}</Text>
          </View>
          {/* Current Score  */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{score.toLocaleString()}</Text>
          </View>
          {/* Best Score  */}
          <View style={styles.statBox}>
                <Text style={styles.statLabel}>Best</Text>
                <Text style={styles.statValue}>{bestScore.toLocaleString()}</Text>
            </View>
          {/* Earned Coins  */}
          <Animated.View style={[styles.statBox, { transform: [{ scale: coinPulse }] }]}>
            <Text style={styles.statLabel}>Coins</Text>
            <View style={styles.coinDisplay}>
              {/* <Text style={styles.coinEmoji}>🪙</Text> */}
              <Text style={styles.statValue}>{coins}</Text>
            </View>
          </Animated.View>
        </View>

        <Modal visible={showInstructions} transparent animationType="fade" onRequestClose={() => setShowInstructions(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowInstructions(false)}>
            <View style={styles.instructionsModal}>
              <Text style={styles.modalTitle}>🎮 How to Play</Text>
              <View style={styles.instructionItem}><Text style={styles.instructionIcon}>⬅️➡️⬆️⬇️</Text><Text style={styles.instructionText}>Swipe to move tiles</Text></View>
              <View style={styles.instructionItem}><Text style={styles.instructionIcon}>🍎 + 🍎 = 🍌</Text><Text style={styles.instructionText}>Merge same items to evolve</Text></View>
              <View style={styles.instructionItem}><Text style={styles.instructionIcon}>💣🪙🎁</Text><Text style={styles.instructionText}>Special tiles have amazing effects!</Text></View>
              <View style={styles.instructionItem}><Text style={styles.instructionIcon}>🪙</Text><Text style={styles.instructionText}>Earn coins to unlock premium themes</Text></View>
              <View style={styles.instructionItem}><Text style={styles.instructionIcon}>🎯</Text><Text style={styles.instructionText}>Goal: Get highest score and unlock themes!</Text></View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowInstructions(false)}><Text style={styles.closeBtnText}>Got it! 🎉</Text></TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: { width: "95%", marginTop: 10, paddingTop: 12, paddingHorizontal: 16, borderRadius: 20, elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, position: 'relative' },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "900", color: "#ffdd35ff" },
  controls: { flexDirection: "row", alignItems: "center", gap: 8 },
  controlBtn: { width: 22, height: 22, backgroundColor: "#f0f0f0", borderRadius: 16, justifyContent: "center", alignItems: "center" },
  controlIcon: { fontSize: 12 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, gap: 4 },
  statBox: { flex: 1, alignItems: "center", backgroundColor: "#f8f8f8ff", paddingVertical: 8, borderRadius: 12, marginHorizontal: 1 },
  levelStatBox: { flex: 1.5, paddingHorizontal: 4 },
  statLabel: { fontSize: 12, color: "#666", fontWeight: "600" },
  statValue: { fontSize: 12, fontWeight: "800", color: "#333" },
  coinDisplay: { flexDirection: "row", alignItems: "center", gap: 2 },
  coinEmoji: { fontSize: 12 },
  newGameText: { fontSize: 14, fontWeight: "bold", color: "#ffdd35ff" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center" },
  instructionsModal: { backgroundColor: "white", borderRadius: 20, padding: 24, margin: 20, elevation: 10, width: "85%" },
  modalTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  instructionItem: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  instructionIcon: { fontSize: 18, marginRight: 12, width: 40 },
  instructionText: { fontSize: 14, color: "#666", flex: 1 },
  closeBtn: { backgroundColor: "#FF6B35", paddingVertical: 12, borderRadius: 12, marginTop: 12 },
  closeBtnText: { color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 },
  levelText: { fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  progressBarContainer: { width: '100%', height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden', marginBottom: 2 },
  progressBar: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 4 },
  progressText: { fontSize: 10, color: '#666' },
  actionBtn: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, alignItems: "center" },
  activeBtn: {},
  actionText: { fontSize: 14, fontWeight: "bold", color: "#fff" },
});

