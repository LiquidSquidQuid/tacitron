import { EXPO_PUBLIC_SUPABASE_ANON_KEY, EXPO_PUBLIC_SUPABASE_URL } from '@env';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

// Resolve environment variables either from the build-time .env file or from
// the Expo config extras.
const supabaseUrl =
  EXPO_PUBLIC_SUPABASE_URL || (Constants.expoConfig?.extra?.supabaseUrl as string);
const supabaseAnonKey =
  EXPO_PUBLIC_SUPABASE_ANON_KEY || (Constants.expoConfig?.extra?.supabaseAnonKey as string);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and make sure it contains EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
}); 
