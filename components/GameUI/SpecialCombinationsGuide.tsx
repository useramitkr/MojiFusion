// components/GameUI/SpecialCombinationsGuide.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SpecialCombinationsGuide({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.header}
          >
            <Text style={styles.title}>✨ Special Combinations</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            {/* Coin Combinations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🪙 Coin Combinations</Text>
              
              <View style={styles.combinationCard}>
                <View style={styles.combinationRow}>
                  <Text style={styles.tileDisplay}>🪙</Text>
                  <Text style={styles.plusSign}>+</Text>
                  <Text style={styles.tileDisplay}>🪙</Text>
                  <Text style={styles.equalsSign}>=</Text>
                  <Text style={styles.resultDisplay}>🍇</Text>
                </View>
                <Text style={styles.combinationDescription}>
                  Two coins merge into the 3rd highest emoji on your board
                </Text>
                <Text style={styles.bonusText}>💰 Bonus: Extra coins awarded!</Text>
              </View>
            </View>

            {/* Gift Combinations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎁 Gift Combinations</Text>
              
              <View style={styles.combinationCard}>
                <View style={styles.combinationRow}>
                  <Text style={styles.tileDisplay}>🎁</Text>
                  <Text style={styles.plusSign}>+</Text>
                  <Text style={styles.tileDisplay}>🎁</Text>
                  <Text style={styles.equalsSign}>=</Text>
                  <Text style={styles.resultDisplay}>🥥</Text>
                </View>
                <Text style={styles.combinationDescription}>
                  Two gifts merge into the highest emoji on your board
                </Text>
                <Text style={styles.bonusText}>✨ Bonus: Extra switchers and a high-value emoji!</Text>
              </View>
            </View>

            {/* Mixed Combinations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🤝 Mixed Combinations</Text>
              
              <View style={styles.combinationCard}>
                <View style={styles.combinationRow}>
                  <Text style={styles.tileDisplay}>🪙</Text>
                  <Text style={styles.plusSign}>+</Text>
                  <Text style={styles.tileDisplay}>🎁</Text>
                  <Text style={styles.equalsSign}>=</Text>
                  <Text style={styles.resultDisplay}>🍉</Text>
                </View>
                <Text style={styles.combinationDescription}>
                  A coin and a gift merge into the 4th highest emoji on your board
                </Text>
                <Text style={styles.bonusText}>🎉 Bonus: A super combo with a nice reward!</Text>
              </View>

              <View style={styles.combinationCard}>
                <View style={styles.combinationRow}>
                  <Text style={styles.tileDisplay}>💣</Text>
                  <Text style={styles.plusSign}>+</Text>
                  <Text style={styles.tileDisplay}>💣</Text>
                  <Text style={styles.equalsSign}>=</Text>
                  <Text style={styles.resultDisplay}>🦁</Text>
                </View>
                <Text style={styles.combinationDescription}>
                  Two bombs clear the board and create the highest emoji
                </Text>
                <Text style={styles.bonusText}>💥 Bonus: A powerful move to clear the board!</Text>
              </View>

              <View style={styles.combinationCard}>
                <View style={styles.combinationRow}>
                  <Text style={styles.tileDisplay}>💣</Text>
                  <Text style={styles.plusSign}>+</Text>
                  <Text style={styles.tileDisplay}>🪙</Text>
                  <Text style={styles.equalsSign}>=</Text>
                  <Text style={styles.resultDisplay}>🍍</Text>
                </View>
                <Text style={styles.combinationDescription}>
                  A bomb and a coin merge into a random medium tile
                </Text>
                <Text style={styles.bonusText}>🎁 Bonus: An unexpected and useful reward!</Text>
              </View>

              <View style={styles.combinationCard}>
                <View style={styles.combinationRow}>
                  <Text style={styles.tileDisplay}>💣</Text>
                  <Text style={styles.plusSign}>+</Text>
                  <Text style={styles.tileDisplay}>🎁</Text>
                  <Text style={styles.equalsSign}>=</Text>
                  <Text style={styles.resultDisplay}>🥭</Text>
                </View>
                <Text style={styles.combinationDescription}>
                  A bomb and a gift merge into a random high tile
                </Text>
                <Text style={styles.bonusText}>🚀 Bonus: A super powerful reward!</Text>
              </View>
            </View>
          </ScrollView>
        </View>
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
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    maxHeight: "80%",
  },
  header: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a4a4a",
    marginBottom: 12,
  },
  combinationCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  combinationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  tileDisplay: {
    fontSize: 28,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    elevation: 3,
  },
  plusSign: {
    fontSize: 24,
    color: "#666",
    marginHorizontal: 8,
  },
  equalsSign: {
    fontSize: 24,
    color: "#666",
    marginHorizontal: 8,
  },
  resultDisplay: {
    fontSize: 28,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: "#4CAF50",
    elevation: 3,
  },
  combinationDescription: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },
  bonusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF6B35",
    textAlign: "center",
  },
});