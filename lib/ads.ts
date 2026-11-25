import { Platform } from 'react-native';
import mobileAds, {
  AdsConsent,
  MaxAdContentRating,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

/**
 * Official Live AdMob Interstitial ID directly from .env with fallback to live registered ID.
 * Always the real interstitial unit (Gecis Reklami); never Google's test units.
 */
const LIVE_INTERSTITIAL_AD_UNIT_ID = Platform.select({
  android:
    process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID ||
    'ca-app-pub-4674211063760769/1648946280',
  ios:
    process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_IOS ||
    'ca-app-pub-4674211063760769/1648946280',
  default:
    process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID ||
    'ca-app-pub-4674211063760769/1648946280',
});

export const INTERSTITIAL_AD_UNIT_ID = LIVE_INTERSTITIAL_AD_UNIT_ID;

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

let adsInitialized = false;
let initPromise: Promise<boolean> | null = null;
const readyListeners = new Set<() => void>();

export const onAdsReady = (cb: () => void): (() => void) => {
  if (adsInitialized) {
    cb();
    return () => {};
  }
  readyListeners.add(cb);
  return () => {
    readyListeners.delete(cb);
  };
};

const notifyAdsReady = () => {
  adsInitialized = true;
  readyListeners.forEach((cb) => {
    try {
      cb();
    } catch {}
  });
  readyListeners.clear();
};

export const initializeAds = async (): Promise<boolean> => {
  if (adsInitialized) return true;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // 1. Configure Mobile Ads settings first
      await mobileAds()
        .setRequestConfiguration({
          maxAdContentRating: MaxAdContentRating.G,
          tagForChildDirectedTreatment: false,
          tagForUnderAgeOfConsent: false,
        })
        .catch(() => {});

      // 2. Request consent info update (Google User Messaging Platform) with timeout
      try {
        const consentInfo = await withTimeout(
          AdsConsent.requestInfoUpdate({ tagForUnderAgeOfConsent: false }),
          5000
        );
        if (consentInfo.isConsentFormAvailable && consentInfo.status === 'REQUIRED') {
          await withTimeout(AdsConsent.showForm(), 10000);
        }
      } catch (_consentError) {
        // Proceed with initialization even if UMP is not configured or times out
      }

      // 3. Initialize the Mobile Ads SDK
      await withTimeout(mobileAds().initialize(), 8000);
      notifyAdsReady();

      // 4. Preload the first interstitial ad in the background
      loadInterstitialAd();

      return true;
    } catch (_error) {
      try {
        await mobileAds().initialize();
      } catch {}
      notifyAdsReady();
      loadInterstitialAd();
      return false;
    }
  })();

  return initPromise;
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

// Interstitials only at natural breaks: never in the first 2 minutes, at most one every 4 minutes
// and 5 per session. Prayer notifications and app launch never trigger one.
const SESSION_START = Date.now();
const FIRST_AD_DELAY_MS = 2 * 60 * 1000;
const MIN_GAP_MS = 4 * 60 * 1000;
const MAX_PER_SESSION = 5;
let lastInterstitialAt = 0;
let interstitialsShown = 0;

export const showInterstitialIfDue = async (_reason: string): Promise<boolean> => {
  const now = Date.now();
  if (now - SESSION_START < FIRST_AD_DELAY_MS) return false;
  if (interstitialsShown >= MAX_PER_SESSION) return false;
  if (lastInterstitialAt && now - lastInterstitialAt < MIN_GAP_MS) return false;
  const shown = await showInterstitialAd();
  if (shown) {
    lastInterstitialAt = now;
    interstitialsShown += 1;
  }
  return shown;
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

