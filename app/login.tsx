import { AuthError } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Platform, StyleSheet, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      if (session) {
        router.replace('/play');
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session);
      if (event === 'SIGNED_IN' && session) {
        router.replace('/play');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      
      const redirectUrl = Platform.OS === 'web' 
        ? window.location.origin
        : 'exp://localhost:19000'; // Expo development URL
        
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) throw error;
      
      Toast.show({
        type: 'success',
        text1: 'Magic link sent!',
        text2: 'Check your email to continue',
      });
    } catch (error) {
      const authError = error as AuthError;
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: authError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button
        title={loading ? 'Sending...' : 'Send Magic Link'}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    maxWidth: Platform.OS === 'web' ? 400 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 50,
  },
}); 