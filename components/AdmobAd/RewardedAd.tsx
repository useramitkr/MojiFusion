import React,
{
  createContext,
  useContext,
  useState,
  ReactNode
} from 'react';
import { Platform } from 'react-native';
import {
  RewardedAd as AdmobRewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const androidAdmobRewarded = "ca-app-pub-3010808812913571/2397042944";
const iosAdmobRewarded = "ca-app-pub-12345678910/12345678910"; // Placeholder for iOS

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === 'ios'
  ? iosAdmobRewarded
  : androidAdmobRewarded;

interface RewardedAdContextType {
  loadAndShowAd: (onEarned: () => void) => void;
  adLoaded: boolean;
}

const RewardedAdContext = createContext<RewardedAdContextType | undefined>(undefined);

export const useRewardedAd = () => {
  const context = useContext(RewardedAdContext);
  if (!context) {
    throw new Error('useRewardedAd must be used within a RewardedAdProvider');
  }
  return context;
};

interface RewardedAdProviderProps {
  children: ReactNode;
}

export const RewardedAdProvider: React.FC<RewardedAdProviderProps> = ({ children }) => {
  const [adLoaded, setAdLoaded] = useState(false);

  const loadAndShowAd = (onEarned: () => void) => {
    const rewardedAd = AdmobRewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setAdLoaded(true);
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
            setAdLoaded(false);
        }
    )


    rewardedAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  };

  return (
    <RewardedAdContext.Provider value={{ loadAndShowAd, adLoaded }}>
      {children}
    </RewardedAdContext.Provider>
  );
};
