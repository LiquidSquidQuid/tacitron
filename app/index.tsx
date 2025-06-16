import { Link, Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabaseClient';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Index session check:', session);
      setSession(session);
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Index auth change:', event, session);
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>TACITRON</Text>
      </View>
    );
  }

  if (session) {
    return <Redirect href="/play" />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f0f11', '#1a1a2e', '#16213e']}
        style={styles.background}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={Platform.OS === 'web' ? styles.titleWeb : styles.title}>TACITRON</Text>
            <Text style={styles.subtitle}>COMMAND THE VOID</Text>
          </View>
          
          <View style={styles.description}>
            <Text style={styles.descriptionText}>
              Master the art of strategic warfare in the depths of space. 
              Build your fleet, manage resources, and dominate the galaxy 
              through tactical brilliance.
            </Text>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>Real-time Strategy</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🚀</Text>
              <Text style={styles.featureText}>Fleet Management</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🌌</Text>
              <Text style={styles.featureText}>Galaxy Conquest</Text>
            </View>
          </View>

          <View style={styles.buttons}>
            <Pressable 
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push('/signup')}
            >
              <Text style={styles.primaryButtonText}>JOIN THE FLEET</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.secondaryButtonText}>COMMANDER LOGIN</Text>
            </Pressable>
          </View>
        </View>
        
        {Platform.OS !== 'web' && (
          <View style={styles.particles}>
            {[...Array(20)].map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.particle,
                  {
                    left: Math.random() * width,
                    top: Math.random() * height,
                  }
                ]} 
              />
            ))}
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f0f11',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#00ff88',
    fontSize: 32,
    fontWeight: 'bold',
    ...(Platform.OS !== 'web' && { letterSpacing: 4 }),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00ff88',
    ...(Platform.OS !== 'web' && { 
      letterSpacing: 6,
      textShadowColor: '#00ff88',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    }),
  },
  titleWeb: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  subtitle: {
    fontSize: 16,
    color: '#64b5f6',
    marginTop: 10,
    opacity: 0.8,
    ...(Platform.OS !== 'web' && { letterSpacing: 3 }),
  },
  description: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#b0b0b0',
    textAlign: 'center',
    ...(Platform.OS !== 'web' && { letterSpacing: 1 }),
  },
  buttons: {
    width: '100%',
    paddingHorizontal: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
    ...(Platform.OS !== 'web' && { letterSpacing: 2 }),
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#00ff88',
    borderRadius: 1,
    opacity: 0.3,
  },
}); 