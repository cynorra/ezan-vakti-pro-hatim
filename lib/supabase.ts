import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// NOT: Kullanıcı bu değerleri kendi Supabase projesinden almalıdır.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const customStorage = Platform.OS === 'web' 
  ? {
      getItem: (key: string) => AsyncStorage.getItem(key),
      setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
      removeItem: (key: string) => AsyncStorage.removeItem(key),
    }
  : {
      getItem: (key: string) => SecureStore?.getItemAsync ? SecureStore.getItemAsync(key) : Promise.resolve(null),
      setItem: (key: string, value: string) => SecureStore?.setItemAsync ? SecureStore.setItemAsync(key, value) : Promise.resolve(),
      removeItem: (key: string) => SecureStore?.deleteItemAsync ? SecureStore.deleteItemAsync(key) : Promise.resolve(),
    };

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
