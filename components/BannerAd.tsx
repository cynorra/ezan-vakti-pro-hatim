import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { BannerAd as AdMobBanner, BannerAdSize } from 'react-native-google-mobile-ads';

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
}

export const BannerAd: React.FC<BannerAdProps> = ({
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
}) => {
  const { width } = useWindowDimensions();
  const [isLoaded, setIsLoaded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // If ad encounters a transient error or no-fill, retry gracefully after 30s instead of permanently hiding
  const handleAdFailedToLoad = (error: any) => {
    if (__DEV__) {
      console.log('[AdMob Banner Load Error]:', error);
    }
    setIsLoaded(false);
    const timer = setTimeout(() => {
      setReloadKey((k) => k + 1);
    }, 30000);
    return () => clearTimeout(timer);
  };

  if (!BANNER_AD_UNIT_ID || width === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          maxWidth: width,
          overflow: 'hidden',
          opacity: isLoaded ? 1 : 0,
          height: isLoaded ? undefined : 0,
        },
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
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
});

