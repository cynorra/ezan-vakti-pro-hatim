import React, { useState } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { BannerAd as AdMobBanner, BannerAdSize } from 'react-native-google-mobile-ads';

// Official Live AdMob Banner IDs directly from .env with fallback to real registered unit ID
const BANNER_AD_UNIT_ID = Platform.select({
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

interface BannerAdProps {
  size?: BannerAdSize;
}

export const BannerAd: React.FC<BannerAdProps> = ({
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
}) => {
  const { width } = useWindowDimensions();
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Silent fail: If ad encounters an error or no unit ID is present, render nothing
  if (hasError || !BANNER_AD_UNIT_ID) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          maxWidth: width,
          overflow: 'hidden',
          display: isLoaded ? 'flex' : 'none',
        },
      ]}
    >
      <AdMobBanner
        unitId={BANNER_AD_UNIT_ID}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdFailedToLoad={(_error) => {
          // Silent Fail: suppress error and hide container completely
          setHasError(true);
        }}
        onAdLoaded={() => {
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

