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
        {/* Simple Web Header */}
        <View style={styles.webHeader}>
          <View style={styles.webResourceRow}>
            <Text style={styles.webResource}>ENERGY: 142</Text>
            <Text style={styles.webResource}>ALLOY: 89</Text>
            <Text style={styles.webResource}>POWER: 2340</Text>
            <Text style={styles.webResource}>TIER: 12</Text>
          </View>
          <Pressable style={styles.logoutButtonMobile} onPress={handleLogout}>
            <Text style={styles.logoutButtonTextMobile}>LOGOUT</Text>
          </Pressable>
        </View>

        {/* Game Content */}
        <View style={styles.webGameContent}>
          <Text style={styles.webTitle}>TACITRON</Text>
          
          {/* Simple Board Representation */}
          <View style={styles.webBoard}>
            <Text style={styles.webBoardTitle}>TACTICAL GRID</Text>
            <View style={styles.webGrid}>
              {[...Array(36)].map((_, i) => (
                <View key={i} style={styles.webGridCell}>
                  {(i === 5 || i === 10 || i === 15) && <Text style={styles.webPlayerShip}>◆</Text>}
                  {(i === 20 || i === 25 || i === 30) && <Text style={styles.webEnemyShip}>◇</Text>}
                </View>
              ))}
            </View>
          </View>

          {/* Bandwidth Gauge */}
          <View style={styles.webBandwidth}>
            <Text style={styles.webBandwidthLabel}>BANDWIDTH</Text>
            <View style={styles.webProgressBar}>
              <View style={[styles.webProgressFill, { width: `${(currentBP / capBP) * 100}%` }]} />
            </View>
            <Text style={styles.webBandwidthText}>{currentBP}/{capBP} BP</Text>
          </View>

          {/* Commands */}
          <View style={styles.webCommands}>
            <Text style={styles.webCommandsTitle}>COMMANDS</Text>
            <View style={styles.webCommandRow}>
              {['deploy', 'scan', 'hub', 'pass', 'help'].map((cmd) => (
                <Pressable key={cmd} style={styles.webCommand}>
                  <Text style={styles.webCommandText}>{cmd}</Text>
                </Pressable>
              ))}
            </View>
          </View>
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
  // Web-specific game interface styles
  webHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161618',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2e',
  },
  webResourceRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  webResource: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '600',
  },
  webGameContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  webBoard: {
    marginVertical: 20,
    alignItems: 'center',
  },
  webBoardTitle: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  webGrid: {
    width: 240,
    height: 240,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#374151',
  },
  webGridCell: {
    width: 40,
    height: 40,
    backgroundColor: '#1f2937',
    borderWidth: 0.5,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webPlayerShip: {
    color: '#60a5fa',
    fontSize: 18,
    fontWeight: 'bold',
  },
  webEnemyShip: {
    color: '#f87171',
    fontSize: 18,
    fontWeight: 'bold',
  },
  webBandwidth: {
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  webBandwidthLabel: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  webProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  webProgressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 4,
  },
  webBandwidthText: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
  },
  webCommands: {
    marginTop: 20,
    alignItems: 'center',
  },
  webCommandsTitle: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  webCommandRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  webCommand: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1f2937',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#374151',
    marginHorizontal: 4,
    marginVertical: 2,
  },
  webCommandText: {
    color: '#e5e7eb',
    fontSize: 12,
  },
}); 