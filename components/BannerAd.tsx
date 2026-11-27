import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions, ViewStyle } from 'react-native';
import { BannerAd as AdMobBanner, BannerAdSize } from 'react-native-google-mobile-ads';
import { initializeAds, onAdsReady } from '@/lib/ads';

// Official Live AdMob Banner IDs directly from .env with fallback to real registered unit ID
const LIVE_BANNER_AD_UNIT_ID = Platform.select({
  android:
    process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID ||
    'ca-app-pub-4674211063760769/3925185177',
  ios:
    process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_IOS ||
    'ca-app-pub-4674211063760769/3925185177',
  default:
    process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID ||
    'ca-app-pub-4674211063760769/3925185177',
});

// Always the real banner unit, in every build type
export const BANNER_AD_UNIT_ID = LIVE_BANNER_AD_UNIT_ID;

export const SCREEN_BANNER_IDS = {
  default: LIVE_BANNER_AD_UNIT_ID,
  home: 'ca-app-pub-4674211063760769/6661809248',
  kible: 'ca-app-pub-4674211063760769/7831420686',
  tesbih: 'ca-app-pub-4674211063760769/9096400898',
  hatim: 'ca-app-pub-4674211063760769/8657417194',
  dua: 'ca-app-pub-4674211063760769/6031253856',
  kaza: 'ca-app-pub-4674211063760769/9150699229',
} as const;

export type BannerPlacement = keyof typeof SCREEN_BANNER_IDS;

export const INLINE_BANNER_AD_UNIT_ID = SCREEN_BANNER_IDS.default;

const RETRY_DELAYS_MS = [30000, 60000, 120000];

interface BannerAdProps {
  unitId?: string;
  size?: BannerAdSize;
  /** Extra spacing for in-content placements; only applied while an ad is actually showing. */
  style?: ViewStyle;
}

export const BannerAd: React.FC<BannerAdProps> = ({
  unitId = BANNER_AD_UNIT_ID,
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  style,
}) => {
  const { width } = useWindowDimensions();
  const [sdkReady, setSdkReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const retryCount = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    initializeAds();
    const unsub = onAdsReady(() => setSdkReady(true));
    return () => {
      unsub();
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, []);

  // Exponential backoff (30s -> 60s -> 120s, max 3 retries) to avoid AdMob rate-limit throttling
  const handleAdFailedToLoad = (error: any) => {
    if (__DEV__) {
      console.log('[AdMob Banner Load Error]:', error);
    }
    setIsLoaded(false);
    if (retryCount.current >= RETRY_DELAYS_MS.length) return;
    const delay = RETRY_DELAYS_MS[retryCount.current];
    retryCount.current += 1;
    if (retryTimer.current) clearTimeout(retryTimer.current);
    retryTimer.current = setTimeout(() => {
      setReloadKey((k) => k + 1);
    }, delay);
  };

  if (Platform.OS === 'web' || !unitId || width === 0 || !sdkReady) {
    return null;
  }

  return (
    <View
      pointerEvents={isLoaded ? 'auto' : 'none'}
      style={[
        styles.container,
        {
          maxWidth: width,
          overflow: 'hidden',
        },
        isLoaded ? style : styles.pending,
      ]}
    >
      <AdMobBanner
        key={reloadKey}
        unitId={unitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdFailedToLoad={handleAdFailedToLoad}
        onAdLoaded={() => {
          if (__DEV__) {
            console.log('[AdMob Banner Loaded Successfully]');
          }
          retryCount.current = 0;
          setIsLoaded(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pending: {
    height: 1,
    opacity: 0,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
});

