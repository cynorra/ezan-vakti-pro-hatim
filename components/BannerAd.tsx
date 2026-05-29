import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd as AdMobBanner, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Official test banner unit IDs or safe wrapper TestIds.BANNER
const adUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      android: 'ca-app-pub-3940256099942544/6300978111', // Replace with real Android Banner ID in production
      ios: 'ca-app-pub-3940256099942544/2934735716',     // Replace with real iOS Banner ID in production
      default: TestIds.BANNER,
    });

interface BannerAdProps {
  size?: BannerAdSize;
}

export const BannerAd: React.FC<BannerAdProps> = ({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null; // Gracefully hide the component if loading fails or there's an error
  }

  return (
    <View style={styles.container}>
      <AdMobBanner
        unitId={adUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false, // Will be respected based on GDPR/KVKK consent status
        }}
        onAdFailedToLoad={(error) => {
          if (__DEV__) {
            console.log('[AdMob Banner Load Error]:', error);
          }
          setHasError(true);
        }}
        onAdLoaded={() => {
          if (__DEV__) {
            console.log('[AdMob Banner Loaded Successfully]');
          }
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
