import mobileAds, { AdsConsent, MaxAdContentRating } from 'react-native-google-mobile-ads';

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

    if (__DEV__) {
      console.log('[AdMob ConsentInfo]:', consentInfo);
    }

    // 2. If consent form is available and required, show the form to the user
    if (consentInfo.isConsentFormAvailable && consentInfo.status === 'REQUIRED') {
      const formResult = await AdsConsent.showForm();
      if (__DEV__) {
        console.log('[AdMob FormResult]:', formResult);
      }
    }

    // 3. Configure Mobile Ads settings (non-personalized ads are handled by SDK based on consent)
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G, // Safe for all ages
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });

    // 4. Initialize the Mobile Ads SDK
    const adapterStatuses = await mobileAds().initialize();
    if (__DEV__) {
      console.log('[AdMob Initialized]:', adapterStatuses);
    }

    return true;
  } catch (error) {
    console.error('[AdMob Init Error]: Failed to initialize Ads or Consent Form:', error);
    
    // Attempt fallback initialization of Mobile Ads directly in case UMP fails (e.g. offline)
    try {
      await withTimeout(mobileAds().initialize(), 8000);
      return true;
    } catch (fallbackError) {
      console.error('[AdMob Fallback Error]: Direct initialization failed:', fallbackError);
      return false;
    }
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
    console.error('[AdMob Consent Status Error]:', error);
    return 'UNKNOWN';
  }
};
