import { AuthError } from '@supabase/supabase-js';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabaseClient';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in all fields',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match',
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password must be at least 6 characters',
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user && !data.session) {
        Toast.show({
          type: 'success',
          text1: 'Verification Required',
          text2: 'Check your email to verify your account',
        });
      } else if (data.session) {
        Toast.show({
          type: 'success',
          text1: 'Welcome Commander!',
          text2: 'Account created successfully',
        });
        router.replace('/play');
      }
    } catch (error) {
      const authError = error as AuthError;
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
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
            <Text style={Platform.OS === 'web' ? styles.titleWeb : styles.title}>JOIN THE FLEET</Text>
            <Text style={styles.subtitle}>Create your commander account</Text>
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

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter secure password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#666"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <Pressable
              style={[styles.button, styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </Text>
            </Pressable>
            
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 After creating your account, you'll receive a confirmation email. 
                Click the link in the email to activate your account and gain access to the game.
              </Text>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable 
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.secondaryButtonText}>ALREADY A COMMANDER?</Text>
            </Pressable>
          </View>

          <Pressable 
            style={styles.backButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.backButtonText}>← Back to Home</Text>
          </Pressable>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ff88',
    ...(Platform.OS !== 'web' && {
      letterSpacing: 4,
      textShadowColor: '#00ff88',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 8,
    }),
  },
  titleWeb: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  subtitle: {
    fontSize: 14,
    color: '#64b5f6',
    marginTop: 8,
    opacity: 0.8,
    ...(Platform.OS !== 'web' && { letterSpacing: 2 }),
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
    marginBottom: 8,
    fontWeight: 'bold',
    ...(Platform.OS !== 'web' && { letterSpacing: 1 }),
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
    ...(Platform.OS !== 'web' && { letterSpacing: 2 }),
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: '#64b5f6',
  },
  secondaryButtonText: {
    color: '#64b5f6',
    fontSize: 14,
    fontWeight: 'bold',
    ...(Platform.OS !== 'web' && { letterSpacing: 1 }),
  },
  buttonTextLarge: {
    fontSize: 18,
  },
  disabledButton: {
    opacity: 0.6,
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
    ...(Platform.OS !== 'web' && { letterSpacing: 1 }),
  },
  backButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#666',
    fontSize: 14,
    ...(Platform.OS !== 'web' && { letterSpacing: 1 }),
  },
  infoBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  infoText: {
    color: '#64b5f6',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    opacity: 0.9,
  },
});