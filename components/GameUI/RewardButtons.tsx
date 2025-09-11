import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useGame } from '@/context/GameContext';

const RewardButtons = () => {
  // Use the new showRewardedAd function and loading state from the context
  const { addKey, addCoins, showRewardedAd, rewardedAdLoadingFor } = useGame();

  const handleGetExtraKey = () => {
    // Call the context function to show an ad for a key
    showRewardedAd(() => {
      addKey();
    }, 'key');
  };

  const handleGetExtraCoins = () => {
    // Call the context function to show an ad for coins
    showRewardedAd(() => {
      addCoins(180);
    }, 'coins');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleGetExtraKey} disabled={!!rewardedAdLoadingFor}>
        {rewardedAdLoadingFor === 'key' ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>🔑 Get Extra Key</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleGetExtraCoins} disabled={!!rewardedAdLoadingFor}>
        {rewardedAdLoadingFor === 'coins' ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>🪙 Get 180 Coins</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 150,
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default RewardButtons;
