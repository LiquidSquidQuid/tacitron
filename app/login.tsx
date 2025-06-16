import { AuthError } from '@supabase/supabase-js';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);

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
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Missing Email',
        text2: 'Please enter your email address',
      });
      return;
    }

    if (!useMagicLink && !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Password',
        text2: 'Please enter your password',
      });
      return;
    }

    try {
      setLoading(true);
      
      if (useMagicLink) {
        const redirectUrl = Platform.OS === 'web' 
          ? window.location.origin
          : 'exp://localhost:19000';
          
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
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        Toast.show({
          type: 'success',
          text1: 'Welcome back, Commander!',
          text2: 'Successfully logged in',
        });
        
        router.replace('/play');
      }
    } catch (error) {
      const authError = error as AuthError;
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: authError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#0f0f11', '#1a1a2e', '#16213e']}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={Platform.OS === 'web' ? styles.titleWeb : styles.title}>COMMANDER LOGIN</Text>
            <Text style={styles.subtitle}>Access your fleet command</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="commander@tacitron.space"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            {!useMagicLink && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="current-password"
                />
              </View>
            )}

            <Pressable
              style={[styles.button, styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading 
                  ? (useMagicLink ? 'SENDING LINK...' : 'LOGGING IN...') 
                  : (useMagicLink ? 'SEND MAGIC LINK' : 'LOGIN')
                }
              </Text>
            </Pressable>

            <Pressable
              style={styles.linkButton}
              onPress={() => setUseMagicLink(!useMagicLink)}
            >
              <Text style={styles.linkButtonText}>
                {useMagicLink ? 'Use password instead' : 'Use magic link instead'}
              </Text>
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Link href="/signup" asChild>
              <Pressable style={[styles.button, styles.secondaryButton]}>
                <Text style={styles.secondaryButtonText}>CREATE NEW ACCOUNT</Text>
              </Pressable>
            </Link>
          </View>

          <Link href="/" asChild>
            <Pressable style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back to Home</Text>
            </Pressable>
          </Link>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ff88',
    letterSpacing: 3,
    textShadowColor: '#00ff88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  titleWeb: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ff88',
    letterSpacing: '3px',
    textShadow: '0 0 8px #00ff88',
  },
  subtitle: {
    fontSize: 14,
    color: '#64b5f6',
    letterSpacing: 2,
    marginTop: 8,
    opacity: 0.8,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    color: '#00ff88',
    letterSpacing: 1,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#fff',
    minHeight: 50,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#00ff88',
    borderColor: '#00ff88',
  },
  primaryButtonText: {
    color: '#0f0f11',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: '#64b5f6',
  },
  secondaryButtonText: {
    color: '#64b5f6',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  linkButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  linkButtonText: {
    color: '#999',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 16,
    fontSize: 12,
    letterSpacing: 1,
  },
  backButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#666',
    fontSize: 14,
    letterSpacing: 1,
  },
}); 