// components/GameUI/GameOverModal.tsx
import React, { useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated,
  Dimensions,
} from "react-native";
import { useGame } from "@/context/GameContext";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onRestart: () => void;
  onNewGame: () => void;
};

export default function GameOverModal({ visible, onRestart, onNewGame }: Props) {
  const { score, bestScore, coins, playSound } = useGame();
  
  // Animation values
  const scaleValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(0)).current;
  const glowValue = useRef(new Animated.Value(0)).current;
  const confettiValues = useRef(
    Array.from({ length: 12 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(1),
    }))
  ).current;

  // Entrance animation
  useEffect(() => {
    if (visible) {
      playSound('success');
      
      // Reset animation values
      scaleValue.setValue(0);
      rotateValue.setValue(0);
      bounceValue.setValue(0);
      glowValue.setValue(0);
      
      // Main modal animation
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Rotation animation for game over text
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Bounce animation for score
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceValue, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(bounceValue, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 500);

      // Glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Confetti animation
      confettiValues.forEach((confetti, index) => {
        const delay = index * 100;
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(confetti.x, {
              toValue: (Math.random() - 0.5) * width,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(confetti.y, {
              toValue: 400,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(confetti.rotate, {
              toValue: Math.random() * 4,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(confetti.scale, {
                toValue: 1.5,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(confetti.scale, {
                toValue: 0,
                duration: 1900,
                useNativeDriver: true,
              }),
            ]),
          ]).start();
        }, delay);
      });
    }
  }, [visible]);

  const isNewBestScore = score > 0 && score === bestScore;

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const bounceInterpolate = bounceValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const glowInterpolate = glowValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const confettiColors = ['#FF6B35', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'];
  const confettiEmojis = ['🎉', '🎊', '✨', '🌟', '💫', '🎈'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        {/* Confetti */}
        {confettiValues.map((confetti, index) => {
          const rotateConfetti = confetti.rotate.interpolate({
            inputRange: [0, 1, 2, 3, 4],
            outputRange: ['0deg', '90deg', '180deg', '270deg', '360deg'],
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.confetti,
                {
                  backgroundColor: confettiColors[index % confettiColors.length],
                  transform: [
                    { translateX: confetti.x },
                    { translateY: confetti.y },
                    { rotate: rotateConfetti },
                    { scale: confetti.scale },
                  ],
                },
              ]}
            >
              <Text style={styles.confettiEmoji}>
                {confettiEmojis[index % confettiEmojis.length]}
              </Text>
            </Animated.View>
          );
        })}

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleValue }],
              opacity: glowInterpolate,
            },
          ]}
        >
          <LinearGradient
            colors={['#FF6B35', '#FF8A50', '#FF6B35']}
            style={styles.gradient}
          >
            {/* Header */}
            <Animated.View
              style={[
                styles.header,
                {
                  transform: [{ rotate: rotateInterpolate }],
                },
              ]}
            >
              <Text style={styles.gameOverText}>Game Over!</Text>
              <Text style={styles.gameOverEmoji}>💥</Text>
            </Animated.View>

            {/* Score Section */}
            <View style={styles.scoreSection}>
              <Animated.View
                style={[
                  styles.scoreCard,
                  {
                    transform: [{ scale: bounceInterpolate }],
                  },
                ]}
              >
                <Text style={styles.scoreLabel}>Final Score</Text>
                <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
                
                {isNewBestScore && (
                  <View style={styles.newBestBadge}>
                    <Text style={styles.newBestText}>🏆 NEW BEST!</Text>
                  </View>
                )}
              </Animated.View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statEmoji}>🏆</Text>
                  <Text style={styles.statLabel}>Best</Text>
                  <Text style={styles.statValue}>{bestScore.toLocaleString()}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statEmoji}>🪙</Text>
                  <Text style={styles.statLabel}>Coins</Text>
                  <Text style={styles.statValue}>{coins}</Text>
                </View>
              </View>
            </View>

            {/* Messages */}
            <View style={styles.messageSection}>
              {score >= 10000 && (
                <Text style={styles.achievementText}>🌟 Amazing! You scored over 10,000!</Text>
              )}
              {score >= 5000 && score < 10000 && (
                <Text style={styles.achievementText}>🎉 Great job! You&apos;re getting better!</Text>
              )}
              {score < 5000 && (
                <Text style={styles.encouragementText}>Keep practicing! You&apos;ll improve with time! 💪</Text>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonSection}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  playSound('success');
                  onNewGame();
                }}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45A049']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonEmoji}>🎮</Text>
                  <Text style={styles.primaryButtonText}>New Game</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  playSound('success');
                  onRestart();
                }}
              >
                <Text style={styles.secondaryButtonText}>🔄 Try Again</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 350,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  gradient: {
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  gameOverEmoji: {
    fontSize: 40,
    marginTop: 8,
  },
  scoreSection: {
    marginBottom: 24,
  },
  scoreCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FF6B35",
    textShadowColor: "rgba(255, 107, 53, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  newBestBadge: {
    backgroundColor: "#FFD700",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 12,
  },
  newBestText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333",
  },
  messageSection: {
    marginBottom: 24,
  },
  achievementText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 12,
  },
  encouragementText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 12,
  },
  buttonSection: {
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  confetti: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    top: -20,
    left: width / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  confettiEmoji: {
    fontSize: 16,
  },
});