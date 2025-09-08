// components/GameUI/Tutorial.tsx
import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  PanResponder,
  PanResponderInstance
} from "react-native";
import { useGame } from "@/context/GameContext";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type TutorialStep = {
  id: number;
  title: string;
  description: string;
  emoji: string;
  action?: string;
  board?: number[][];
};

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: "Welcome to MojiFusion! 🎉",
    description: "Let's learn how to play this exciting emoji merging game!",
    emoji: "👋",
  },
  {
    id: 2,
    title: "Meet Your Board",
    description: "This is your 4x4 game board. Each tile can contain an emoji or be empty.",
    emoji: "📱",
    board: [
      [2, 0, 0, 0],
      [0, 0, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  },
  {
    id: 3,
    title: "Swipe to Move",
    description: "Swipe UP, DOWN, LEFT, or RIGHT to move all tiles in that direction.",
    emoji: "👆",
    action: "Try swiping right now!",
    board: [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  },
  {
    id: 4,
    title: "Merge Magic! ✨",
    description: "When two identical emojis collide, they merge into the next emoji in the sequence!",
    emoji: "🍎",
    board: [
      [4, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  },
  {
    id: 5,
    title: "Special Power-ups! 🌟",
    description: "Watch out for special tiles:\n💣 Bomb - Clears surrounding tiles\n🪙 Coin - Bonus points\n🎁 Reward - Extra switchers",
    emoji: "⭐",
  },
  {
    id: 6,
    title: "Ready to Play! 🎮",
    description: "Your goal is to create higher-value emojis and achieve the highest score possible. Good luck!",
    emoji: "🚀",
  },
];

type Props = {
  visible: boolean;
  onComplete: () => void;
};

export default function Tutorial({ visible, onComplete }: Props) {
  const { theme, playSound } = useGame();
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSwipedInTutorial, setHasSwipedInTutorial] = useState(false);
  
  // Animation values
  const fadeValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const slideValue = useRef(new Animated.Value(50)).current;

  // Demo board state
  const [demoBoard, setDemoBoard] = useState(TUTORIAL_STEPS[currentStep]?.board || [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]);

  // Entrance animation
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(slideValue, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeValue, scaleValue, slideValue]);

  // Update demo board when step changes
  useEffect(() => {
    const step = TUTORIAL_STEPS[currentStep];
    if (step?.board) {
      setDemoBoard(step.board);
    }
    setHasSwipedInTutorial(false);
  }, [currentStep]);

  // Pan responder for tutorial swipe detection
  const panResponder: PanResponderInstance = PanResponder.create({
    onStartShouldSetPanResponder: () => currentStep === 2, // Only for the swipe step
    onMoveShouldSetPanResponder: () => currentStep === 2,
    
    onPanResponderRelease: (evt, gestureState) => {
      if (currentStep !== 2) return;
      
      const { dx } = gestureState;
      const sensitivity = 50;
      
      if (Math.abs(dx) > sensitivity) {
        if (!hasSwipedInTutorial) {
          setHasSwipedInTutorial(true);
          playSound('swipe');
          
          // Animate the merge
          setTimeout(() => {
            setDemoBoard([
              [4, 0, 0, 0],
              [0, 0, 0, 0],
              [0, 0, 0, 0],
              [0, 0, 0, 0]
            ]);
            playSound('merge');
          }, 200);
        }
      }
    },
  });

  const nextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      playSound('success');
      
      // Animate out current content
      Animated.parallel([
        Animated.timing(slideValue, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep + 1);
        
        // Animate in new content
        slideValue.setValue(50);
        Animated.parallel([
          Animated.timing(slideValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      playSound('unlock');
      onComplete();
    }
  };

  const skipTutorial = () => {
    playSound('success');
    onComplete();
  };

  const step = TUTORIAL_STEPS[currentStep];
  const isSwipeStep = currentStep === 2;
  const canProceed = !isSwipeStep || hasSwipedInTutorial;

  if (!visible || !step) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={skipTutorial}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeValue,
              transform: [
                { scale: scaleValue },
                { translateY: slideValue },
              ],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.stepCounter}>
              Step {currentStep + 1} of {TUTORIAL_STEPS.length}
            </Text>
            <TouchableOpacity onPress={skipTutorial} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.emoji}>{step.emoji}</Text>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>

            {/* Demo Board */}
            {step.board && (
              <View style={styles.demoBoardContainer} {...(isSwipeStep ? panResponder.panHandlers : {})}>
                <LinearGradient
                  colors={['#b8a391', '#a68b5b']}
                  style={styles.demoBoard}
                >
                  {demoBoard.map((row, i) => (
                    <View key={i} style={styles.demoRow}>
                      {row.map((val, j) => (
                        <View
                          key={`${i}-${j}`}
                          style={[
                            styles.demoTile,
                            val !== 0 && styles.demoTileFilled,
                          ]}
                        >
                          {val !== 0 && (
                            <Text style={styles.demoTileText}>
                              {val === 2 ? '🍎' : val === 4 ? '🍌' : '🍇'}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  ))}
                </LinearGradient>
              </View>
            )}

            {/* Action prompt */}
            {step.action && (
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>{step.action}</Text>
                {isSwipeStep && !hasSwipedInTutorial && (
                  <View style={styles.swipeIndicator}>
                    <Text style={styles.swipeArrow}>👆</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }
                ]} 
              />
            </View>
          </View>

          {/* Navigation */}
          <View style={styles.navigation}>
            <TouchableOpacity
              style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
              onPress={nextStep}
              disabled={!canProceed}
            >
              <Text style={[styles.nextButtonText, !canProceed && styles.nextButtonTextDisabled]}>
                {currentStep === TUTORIAL_STEPS.length - 1 ? "Let's Play! 🎮" : "Next →"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    width: "100%",
    maxWidth: 400,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 0,
  },
  stepCounter: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
  },
  skipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF6B35",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  demoBoardContainer: {
    marginVertical: 20,
  },
  demoBoard: {
    width: 200,
    height: 200,
    borderRadius: 12,
    padding: 4,
  },
  demoRow: {
    flex: 1,
    flexDirection: "row",
  },
  demoTile: {
    flex: 1,
    margin: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  demoTileFilled: {
    backgroundColor: "#FFE4E1",
    borderWidth: 2,
    borderColor: "#FFB6C1",
  },
  demoTileText: {
    fontSize: 24,
  },
  actionContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
  },
  swipeIndicator: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderStyle: "dashed",
  },
  swipeArrow: {
    fontSize: 24,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 3,
  },
  navigation: {
    padding: 20,
    paddingTop: 0,
  },
  nextButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  nextButtonTextDisabled: {
    color: "#999",
  },
});