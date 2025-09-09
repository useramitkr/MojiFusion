// file: app/(tabs)/themes.tsx
import { useGame } from "@/context/GameContext";
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import Legal from "@/components/GameUI/legal";
import { THEME_DATA } from "@/game/themes";

const CATEGORIES = ["Nature", "Animals", "Human", "Activities", "Fantasy", "Transport"];

export default function ThemesScreen() {
  const { theme, setTheme, bestScore, coins, unlockedThemes, buyTheme, playSound } = useGame();

  const getThemesByCategory = (category: string) => {
    return THEME_DATA.filter(t => t.category === category);
  };

  const getProgressToNextTheme = () => {
    const nextTheme = THEME_DATA
      .filter(t => t.requiredScore > bestScore && !unlockedThemes.includes(t.id))
      .sort((a, b) => a.requiredScore - b.requiredScore)[0];
    
    if (!nextTheme) return null;
    
    const pointsNeeded = nextTheme.requiredScore - bestScore;
    return { theme: nextTheme, pointsNeeded };
  };

  const isThemeUnlocked = (themeId: string) => {
    return unlockedThemes.includes(themeId);
  };
  
  const handleBuyTheme = (themeId: string) => {
    const themeData = THEME_DATA.find(t => t.id === themeId);
    if (!themeData) return;

    if (coins >= themeData.requiredCoins) {
      Alert.alert(
        "Confirm Purchase",
        `Do you want to spend ${themeData.requiredCoins} coins to unlock the "${themeData.name}" theme?`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => playSound('error')
          },
          {
            text: "Buy",
            onPress: () => {
              if (buyTheme(themeId)) {
                setTheme(themeId);
              }
            }
          }
        ]
      );
    } else {
      Alert.alert("Not Enough Coins", "You do not have enough coins to purchase this theme.");
      playSound('error');
    }
  };

  const nextThemeProgress = getProgressToNextTheme();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.subtitle}>Best Score: {bestScore.toLocaleString()} pts</Text>
          <View style={styles.coinDisplay}>
            <Text style={styles.coinEmoji}>🪙</Text>
            <Text style={styles.subtitle}>{coins.toLocaleString()}</Text>
          </View>
        </View>
        
        {nextThemeProgress && (
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>
              Next Score Unlock: {nextThemeProgress.theme.name} {nextThemeProgress.theme.icon}
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
        <Legal />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {CATEGORIES.map((category) => {
          const categoryThemes = THEME_DATA.filter(t => t.category === category);
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
                  const unlockedByScore = bestScore >= themeData.requiredScore;
                  const unlockedByPurchase = isThemeUnlocked(themeData.id);
                  const isLocked = !unlockedByScore && !unlockedByPurchase;
                  const isSelected = theme === themeData.id;
                  
                  return (
                    <TouchableOpacity
                      key={themeData.id}
                      style={[
                        styles.themeCard,
                        isLocked && styles.lockedCard,
                        isSelected && styles.selectedCard,
                      ]}
                      onPress={() => {
                        if (unlockedByScore || unlockedByPurchase) {
                          setTheme(themeData.id);
                        } else if (coins >= themeData.requiredCoins) {
                          handleBuyTheme(themeData.id);
                        } else {
                          playSound('error');
                          Alert.alert("Not Enough Coins", "You don't have enough coins to buy this theme!");
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.cardHeader}>
                        <Text style={styles.themeIcon}>{themeData.icon}</Text>
                        {isSelected && <Text style={styles.selectedBadge}>✓</Text>}
                        {isLocked && <Text style={styles.lockIcon}>🔒</Text>}
                      </View>
                      
                      <Text style={[styles.themeName, isLocked && styles.lockedText]}>
                        {themeData.name}
                      </Text>
                      
                      <View style={styles.previewRow}>
                        {themeData.preview.map((emoji, index) => (
                          <Text 
                            key={index} 
                            style={[
                              styles.previewEmoji, 
                              isLocked && styles.grayedOut
                            ]}
                          >
                            {emoji}
                          </Text>
                        ))}
                      </View>
                      
                      {unlockedByPurchase ? (
                        <Text style={styles.unlockedText}>Purchased! 🎉</Text>
                      ) : unlockedByScore ? (
                        <Text style={styles.unlockedText}>Unlocked! 🎉</Text>
                      ) : (
                        <View style={styles.costContainer}>
                          <Text style={styles.requiredScore}>
                            {themeData.requiredScore.toLocaleString()} pts
                          </Text>
                          <View style={styles.buyButton}>
                            <Text style={styles.buyText}>{themeData.requiredCoins} 🪙</Text>
                          </View>
                        </View>
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
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    fontWeight: "600",
  },
  coinDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  coinEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  progressCard: {
    backgroundColor: "#f0f8ff",
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
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
  costContainer: {
    alignItems: 'center',
  },
  buyButton: {
    marginTop: 8,
    backgroundColor: '#FFD700',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  buyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});
