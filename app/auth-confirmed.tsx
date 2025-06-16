import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { supabase } from '../lib/supabaseClient';
import Toast from 'react-native-toast-message';

export default function AuthConfirmed() {
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const handleAuthConfirmation = async () => {
      try {
        // Check if user is authenticated after email confirmation
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth confirmation error:', error);
          Toast.show({
            type: 'error',
            text1: 'Confirmation Error',
            text2: 'There was an issue confirming your account. Please try logging in.',
          });
          setLoading(false);
          return;
        }

        if (session?.user) {
          setConfirmed(true);
          Toast.show({
            type: 'success',
            text1: 'Account Confirmed!',
            text2: 'Welcome to Tacitron, Commander!',
            visibilityTime: 4000,
          });
          
          // Auto-redirect to play after 3 seconds
          setTimeout(() => {
            router.replace('/play');
          }, 3000);
        } else {
          Toast.show({
            type: 'info',
            text1: 'Confirmation Complete',
            text2: 'Please log in to access your account.',
          });
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong. Please try logging in.',
        });
      } finally {
        setLoading(false);
      }
    };

    handleAuthConfirmation();
  }, []);

  const handleContinue = () => {
    if (confirmed) {
      router.replace('/play');
    } else {
      router.replace('/login');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f0f11', '#1a1a2e', '#16213e']}
        style={styles.background}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={Platform.OS === 'web' ? styles.titleWeb : styles.title}>
              {loading ? 'CONFIRMING...' : confirmed ? 'CONFIRMED!' : 'CONFIRMATION'}
            </Text>
            <Text style={styles.subtitle}>
              {loading 
                ? 'Processing your email confirmation...'
                : confirmed 
                  ? 'Your account has been successfully activated'
                  : 'Email confirmation processed'
              }
            </Text>
          </View>

          {!loading && (
            <View style={styles.messageBox}>
              {confirmed ? (
                <>
                  <Text style={styles.successIcon}>✅</Text>
                  <Text style={styles.messageText}>
                    Welcome to the fleet, Commander! Your account is now active and ready for battle.
                  </Text>
                  <Text style={styles.redirectText}>
                    Redirecting to mission control in 3 seconds...
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.infoIcon}>ℹ️</Text>
                  <Text style={styles.messageText}>
                    Email confirmation has been processed. Please log in with your credentials to access your account.
                  </Text>
                </>
              )}
            </View>
          )}

          {!loading && (
            <Pressable 
              style={[styles.button, confirmed ? styles.primaryButton : styles.secondaryButton]}
              onPress={handleContinue}
            >
              <Text style={confirmed ? styles.primaryButtonText : styles.secondaryButtonText}>
                {confirmed ? 'ENTER MISSION CONTROL' : 'GO TO LOGIN'}
              </Text>
            </Pressable>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64b5f6',
    marginTop: 12,
    opacity: 0.8,
    textAlign: 'center',
    ...(Platform.OS !== 'web' && { letterSpacing: 1 }),
  },
  messageBox: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    borderRadius: 12,
    padding: 24,
    marginBottom: 30,
    alignItems: 'center',
    maxWidth: 400,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  messageText: {
    color: '#e0e0e0',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  redirectText: {
    color: '#64b5f6',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    minWidth: 200,
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
    fontSize: 16,
    fontWeight: 'bold',
    ...(Platform.OS !== 'web' && { letterSpacing: 2 }),
  },
});