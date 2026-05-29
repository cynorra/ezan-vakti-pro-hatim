import analytics from '@react-native-firebase/analytics';

/**
 * Log custom app events to Firebase Analytics for AEO (App Event Optimization)
 */
export const logEvent = async (eventName: string, params?: Record<string, any>) => {
  try {
    await analytics().logEvent(eventName, params);
    if (__DEV__) {
      console.log(`[Analytics Logged]: ${eventName}`, params);
    }
  } catch (error) {
    console.error(`[Analytics Error] Failed to log event ${eventName}:`, error);
  }
};

/**
 * Log when a user successfully creates a new Hatim
 */
export const logHatimCreated = async (title: string, language: string) => {
  await logEvent('hatim_created', {
    hatim_title: title,
    language: language,
  });
};

/**
 * Log when a user takes/selects a Juz (Cüz) from a Hatim
 */
export const logJuzSelected = async (juzNumber: number, hatimId: string) => {
  await logEvent('juz_selected', {
    juz_number: juzNumber,
    hatim_id: hatimId,
  });
};

/**
 * Log when a user starts or counts a Tesbih (Zikirmatik)
 */
export const logTesbihStarted = async (name: string, count: number) => {
  await logEvent('tesbih_started', {
    tesbih_name: name,
    initial_count: count,
  });
};

/**
 * Log when a user uses the Qibla (Kıble) compass
 */
export const logQiblaSearched = async () => {
  await logEvent('qibla_searched');
};
