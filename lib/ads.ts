import { Platform } from 'react-native';
import mobileAds, {
  AdsConsent,
  MaxAdContentRating,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

/**
 * Official Live AdMob Interstitial ID directly from .env with fallback to live registered ID
 * NOTE: Never uses TestIds under any circumstances.
 */
export const INTERSTITIAL_AD_UNIT_ID = Platform.select({
  android:
    process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID ||
    'ca-app-pub-4674211063760769/3925185177',
  ios:
    process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_IOS ||
    'ca-app-pub-4674211063760769/3925185177',
  default:
    process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID ||
    'ca-app-pub-4674211063760769/3925185177',
});

let interstitialInstance: InterstitialAd | null = null;
let isInterstitialLoaded = false;
let isInterstitialLoading = false;
let interstitialUnsubscribeLoaded: (() => void) | null = null;
let interstitialUnsubscribeClosed: (() => void) | null = null;
let interstitialUnsubscribeError: (() => void) | null = null;

/**
 * Handles GDPR / KVKK UMP Consent Form and Google Mobile Ads SDK initialization
 */
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('AdMob timeout')), ms)
    ),
  ]);

export const initializeAds = async (): Promise<boolean> => {
  try {
    // 1. Request consent info update (Google User Messaging Platform)
    const consentInfo = await withTimeout(
      AdsConsent.requestInfoUpdate({ tagForUnderAgeOfConsent: false }),
      8000
    );

    // 2. If consent form is available and required, show the form to the user
    if (consentInfo.isConsentFormAvailable && consentInfo.status === 'REQUIRED') {
      await AdsConsent.showForm();
    }

    // 3. Configure Mobile Ads settings
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });

    // 4. Initialize the Mobile Ads SDK
    await mobileAds().initialize();

    // 5. Preload the first interstitial ad in the background
    loadInterstitialAd();

    return true;
  } catch (error) {
    // Attempt fallback initialization of Mobile Ads directly in case UMP fails (e.g. offline)
    try {
      await withTimeout(mobileAds().initialize(), 8000);
      loadInterstitialAd();
      return true;
    } catch (_fallbackError) {
      return false;
    }
  }
};

/**
 * Preload an Interstitial Ad in background.
 * Attaches event listeners including auto-reload when CLOSED.
 */
export const loadInterstitialAd = () => {
  if (!INTERSTITIAL_AD_UNIT_ID || isInterstitialLoading || isInterstitialLoaded) {
    return;
  }

  try {
    // Clean up previous listeners if any
    if (interstitialUnsubscribeLoaded) interstitialUnsubscribeLoaded();
    if (interstitialUnsubscribeClosed) interstitialUnsubscribeClosed();
    if (interstitialUnsubscribeError) interstitialUnsubscribeError();

    isInterstitialLoading = true;
    interstitialInstance = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: false,
    });

    interstitialUnsubscribeLoaded = interstitialInstance.addAdEventListener(
      AdEventType.LOADED,
      () => {
        isInterstitialLoaded = true;
        isInterstitialLoading = false;
      }
    );

    interstitialUnsubscribeClosed = interstitialInstance.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        isInterstitialLoaded = false;
        isInterstitialLoading = false;
        // Kural 4: CLOSED olduğunda bir sonraki gösterim için hemen yenisini yükle
        loadInterstitialAd();
      }
    );

    interstitialUnsubscribeError = interstitialInstance.addAdEventListener(
      AdEventType.ERROR,
      (_error) => {
        // Silent Fail: Kullanıcıya hata hissettirme
        isInterstitialLoaded = false;
        isInterstitialLoading = false;
      }
    );

    interstitialInstance.load();
  } catch (_e) {
    isInterstitialLoading = false;
    isInterstitialLoaded = false;
  }
};

/**
 * Shows the preloaded Interstitial Ad if available.
 * If not available or on error, fails silently without interrupting the user.
 * @returns boolean indicating if the ad was shown
 */
export const showInterstitialAd = async (): Promise<boolean> => {
  if (interstitialInstance && isInterstitialLoaded) {
    try {
      await interstitialInstance.show();
      return true;
    } catch (_e) {
      // Silent fail
      isInterstitialLoaded = false;
      loadInterstitialAd();
      return false;
    }
  } else {
    // Not loaded yet, trigger load for next time and return false silently
    loadInterstitialAd();
    return false;
  }
};

/**
 * Helper to check the current consent status
 */
export const getConsentStatus = async () => {
  try {
    const consentInfo = await AdsConsent.requestInfoUpdate();
    return consentInfo.status;
  } catch (error) {
    return 'UNKNOWN';
  }
};

