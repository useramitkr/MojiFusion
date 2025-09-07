// file: app/(tabs)/themes.tsx
import { useGame } from "@/context/GameContext";
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";

type ThemeData = {
  id: string;
  name: string;
  icon: string;
  requiredScore: number;
  category: string;
  preview: string[];
};

const THEME_DATA: ThemeData[] = [
  // Fruits (Free)
  {
    id: "fruits",
    name: "Fruits",
    icon: "🍎",
    requiredScore: 0,
    category: "Nature",
    preview: ["🍎", "🍌", "🍇", "🍊"]
  },
  
  // Animals (2500 points)
  {
    id: "animals",
    name: "Farm Animals",
    icon: "🐷",
    requiredScore: 2500,
    category: "Animals",
    preview: ["🐷", "🐮", "🐸", "🐔"]
  },
  
  // Wild Animals (5000 points)
  {
    id: "wild_animals",
    name: "Wild Animals",
    icon: "🦁",
    requiredScore: 5000,
    category: "Animals",
    preview: ["🦁", "🐯", "🐻", "🐺"]
  },
  
  // Ocean (7500 points)
  {
    id: "ocean",
    name: "Ocean Life",
    icon: "🐠",
    requiredScore: 7500,
    category: "Nature",
    preview: ["🐠", "🐙", "🦈", "🐳"]
  },
  
  // Faces (10000 points)
  {
    id: "faces",
    name: "Emotions",
    icon: "😀",
    requiredScore: 10000,
    category: "Human",
    preview: ["😀", "😍", "🤩", "😎"]
  },
  
  // Professions (12500 points)
  {
    id: "professions",
    name: "Professions",
    icon: "👨‍⚕️",
    requiredScore: 12500,
    category: "Human",
    preview: ["👨‍⚕️", "👨‍🚀", "👨‍🍳", "👨‍🎨"]
  },
  
  // Sports (15000 points)
  {
    id: "sports",
    name: "Sports",
    icon: "⚽",
    requiredScore: 15000,
    category: "Activities",
    preview: ["⚽", "🏀", "🎾", "🏈"]
  },
  
  // Space (17500 points)
  {
    id: "space",
    name: "Space",
    icon: "🚀",
    requiredScore: 17500,
    category: "Fantasy",
    preview: ["🚀", "🛸", "👽", "🌟"]
  },
  
  // Vehicles (20000 points)
  {
    id: "vehicles",
    name: "Vehicles",
    icon: "🚗",
    requiredScore: 20000,
    category: "Transport",
    preview: ["🚗", "✈️", "🚂", "🚁"]
  },
];

const CATEGORIES = ["Nature", "Animals", "Human", "Activities", "Fantasy", "Transport"];

export default function ThemesScreen() {
  const { theme, setTheme, bestScore } = useGame();

  const getThemesByCategory = (category: string) => {
    return THEME_DATA.filter(t => t.category === category);
  };

  const isThemeUnlocked = (requiredScore: number) => {
    return bestScore >= requiredScore;
  };

  const getProgressToNextTheme = () => {
    const nextTheme = THEME_DATA
      .filter(t => t.requiredScore > bestScore)
      .sort((a, b) => a.requiredScore - b.requiredScore)[0];
    
    if (!nextTheme) return null;
    
    const pointsNeeded = nextTheme.requiredScore - bestScore;
    return { theme: nextTheme, pointsNeeded };
  };

  const nextThemeProgress = getProgressToNextTheme();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎨 Theme Gallery</Text>
        <Text style={styles.subtitle}>Best Score: {bestScore.toLocaleString()} points</Text>
        
        {nextThemeProgress && (
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>
              Next Unlock: {nextThemeProgress.theme.name} {nextThemeProgress.theme.icon}
            </Text>
            <Text style={styles.progressText}>
              {nextThemeProgress.pointsNeeded.toLocaleString()} points needed
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((bestScore / nextThemeProgress.theme.requiredScore) * 100)}%` }
                ]} 
              />
            </View>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {CATEGORIES.map((category) => {
          const categoryThemes = getThemesByCategory(category);
          if (categoryThemes.length === 0) return null;

          return (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.themesRow}
              >
                {categoryThemes.map((themeData) => {
                  const unlocked = isThemeUnlocked(themeData.requiredScore);
                  const isSelected = theme === themeData.id;
                  
                  return (
                    <TouchableOpacity
                      key={themeData.id}
                      style={[
                        styles.themeCard,
                        !unlocked && styles.lockedCard,
                        isSelected && styles.selectedCard,
                      ]}
                      onPress={() => unlocked && setTheme(themeData.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.cardHeader}>
                        <Text style={styles.themeIcon}>{themeData.icon}</Text>
                        {isSelected && <Text style={styles.selectedBadge}>✓</Text>}
                        {!unlocked && <Text style={styles.lockIcon}>🔒</Text>}
                      </View>
                      
                      <Text style={[styles.themeName, !unlocked && styles.lockedText]}>
                        {themeData.name}
                      </Text>
                      
                      <View style={styles.previewRow}>
                        {themeData.preview.map((emoji, index) => (
                          <Text key={index} style={[styles.previewEmoji, !unlocked && styles.grayedOut]}>
                            {emoji}
                          </Text>
                        ))}
                      </View>
                      
                      {!unlocked ? (
                        <Text style={styles.requiredScore}>
                          {themeData.requiredScore.toLocaleString()} pts
                        </Text>
                      ) : (
                        <Text style={styles.unlockedText}>Unlocked! 🎉</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          );
        })}
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
  progressCard: {
    backgroundColor: "#f0f8ff",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  progressText: {
    fontSize: 14,
    color: "#4CAF50",
    textAlign: "center",
    marginVertical: 8,
    fontWeight: "600",
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    marginLeft: 4,
  },
  themesRow: {
    paddingHorizontal: 4,
  },
  themeCard: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  lockedCard: {
    backgroundColor: "#f5f5f5",
    opacity: 0.7,
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: "#FF6B35",
    backgroundColor: "#fff8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  themeIcon: {
    fontSize: 32,
  },
  selectedBadge: {
    fontSize: 16,
    color: "#4CAF50",
  },
  lockIcon: {
    fontSize: 16,
  },
  themeName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  lockedText: {
    color: "#999",
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  previewEmoji: {
    fontSize: 18,
  },
  grayedOut: {
    opacity: 0.3,
  },
  requiredScore: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "bold",
    textAlign: "center",
  },
  unlockedText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "bold",
    textAlign: "center",
  },
});