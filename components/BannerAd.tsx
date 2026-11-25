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

interface BannerAdProps {
  size?: BannerAdSize;
  /** Extra spacing for in-content placements; only applied while an ad is actually showing. */
  style?: ViewStyle;
}

export const BannerAd: React.FC<BannerAdProps> = ({
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  style,
}) => {
  const { width } = useWindowDimensions();
  const [sdkReady, setSdkReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    initializeAds();
    const unsub = onAdsReady(() => setSdkReady(true));
    return () => {
      unsub();
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, []);

  // If ad encounters a transient error or no-fill, retry gracefully after 25s
  const handleAdFailedToLoad = (error: any) => {
    if (__DEV__) {
      console.log('[AdMob Banner Load Error]:', error);
    }
    setIsLoaded(false);
    if (retryTimer.current) clearTimeout(retryTimer.current);
    retryTimer.current = setTimeout(() => {
      setReloadKey((k) => k + 1);
    }, 25000);
  };

  if (Platform.OS === 'web' || !BANNER_AD_UNIT_ID || width === 0 || !sdkReady) {
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
        unitId={BANNER_AD_UNIT_ID}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdFailedToLoad={handleAdFailedToLoad}
        onAdLoaded={() => {
          if (__DEV__) {
            console.log('[AdMob Banner Loaded Successfully]');
          }
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

