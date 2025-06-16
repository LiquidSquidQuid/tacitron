import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, Pressable } from 'react-native';
import { router } from 'expo-router';
import ResourceHud from '../components/ResourceHud';
import BoardPreview from '../components/BoardPreview';
import BandwidthGauge from '../components/BandwidthGauge';
import CommandConsole from '../components/CommandConsole';
import { supabase } from '../lib/supabaseClient';

export default function PlayScreen() {
  const [currentBP, setCurrentBP] = useState(25);
  const capBP = 50;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBP(prev => Math.min(prev + 1, capBP));
    }, 6000);
    return () => clearInterval(interval);
  }, [capBP]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webFallback}>
          <Text style={styles.webTitle}>TACITRON</Text>
          <Text style={styles.webSubtitle}>Game interface loading...</Text>
          <Text style={styles.webInfo}>Energy: 142 | Alloy: 89 | Power: 2340 | Tier: 12</Text>
          <Text style={styles.webInfo}>Bandwidth: {currentBP}/{capBP} BP</Text>
          
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>LOGOUT</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ResourceHud 
          energy={142} 
          alloy={89} 
          power={2340} 
          seasonTier={12} 
        />
        <Pressable style={styles.logoutButtonMobile} onPress={handleLogout}>
          <Text style={styles.logoutButtonTextMobile}>LOGOUT</Text>
        </Pressable>
      </View>
      
      <View style={styles.content}>
        <BoardPreview />
        <BandwidthGauge current={currentBP} max={capBP} />
      </View>
      
      <CommandConsole />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f11',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161618',
    paddingRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 20,
  },
  webSubtitle: {
    fontSize: 18,
    color: '#64b5f6',
    marginBottom: 40,
  },
  webInfo: {
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 10,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButtonMobile: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ef4444',
    borderRadius: 6,
    marginLeft: 'auto',
  },
  logoutButtonTextMobile: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    ...(Platform.OS !== 'web' && { letterSpacing: 1 }),
  },
}); 