import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd as AdMobBanner, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { isAdFreeActive } from '@/lib/rewards';

// Official test banner unit IDs or safe wrapper TestIds.BANNER
const adUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      android: 'ca-app-pub-4674211063760769/3925185177', // Real Android Banner ID
      ios: 'ca-app-pub-3940256099942544/2934735716',     // Replace with real iOS Banner ID in production
      default: TestIds.BANNER,
    });

interface BannerAdProps {
  size?: BannerAdSize;
}

export const BannerAd: React.FC<BannerAdProps> = ({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }) => {
  const [hasError, setHasError] = useState(false);
  const [adFree, setAdFree] = useState(false);

  useEffect(() => {
    isAdFreeActive().then(setAdFree);
  }, []);

  if (hasError || adFree) {
    return null; // Reklamsız ödül aktifse veya yükleme başarısızsa gösterme
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
