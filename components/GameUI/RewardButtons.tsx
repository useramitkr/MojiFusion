import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import {
  RewardedAd as AdmobRewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { useGame } from '@/context/GameContext';

const androidAdmobRewarded = "ca-app-pub-3010808812913571/2397042944";
const iosAdmobRewarded = "ca-app-pub-12345678910/12345678910"; // Placeholder for iOS

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === 'ios'
  ? iosAdmobRewarded
  : androidAdmobRewarded;

const RewardButtons = () => {
  const { addKey, addCoins } = useGame();
  const [loadingAdFor, setLoadingAdFor] = useState<'key' | 'coins' | null>(null);

  const loadAndShowAd = (onEarned: () => void, adType: 'key' | 'coins') => {
    setLoadingAdFor(adType);
    const rewardedAd = AdmobRewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      rewardedAd.show();
    });
    
    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
        onEarned();
      },
    );
    
    const unsubscribeClosed = rewardedAd.addAdEventListener(
        RewardedAdEventType.CLOSED,
        () => {
            setLoadingAdFor(null);
        }
    )

    const unsubscribeError = rewardedAd.addAdEventListener(
      'ad-event',
      (event) => {
        if (event.type === 'error') {
          console.error('Ad failed to load', event.payload);
          setLoadingAdFor(null);
        }
      }
    )

    rewardedAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    };
  };

  const handleGetExtraKey = () => {
    loadAndShowAd(() => {
      addKey();
    }, 'key');
  };

  const handleGetExtraCoins = () => {
    loadAndShowAd(() => {
      addCoins(180);
    }, 'coins');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleGetExtraKey} disabled={!!loadingAdFor}>
        {loadingAdFor === 'key' ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>🔑 Get Extra Key</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleGetExtraCoins} disabled={!!loadingAdFor}>
        {loadingAdFor === 'coins' ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>🪙 Get 180 Coins</Text>}
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

