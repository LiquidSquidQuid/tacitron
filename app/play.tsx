import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, Pressable, Dimensions, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import ResourceHud from '../components/ResourceHud';
import BoardPreview from '../components/BoardPreview';
import BandwidthGauge from '../components/BandwidthGauge';
import CommandConsole from '../components/CommandConsole';
import { supabase } from '../lib/supabaseClient';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 768;
const isTablet = width >= 768 && width < 1024;
const isLargeScreen = width >= 1024;

export default function PlayScreen() {
  const [currentBP, setCurrentBP] = useState(25);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const capBP = 50;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBP(prev => Math.min(prev + 1, capBP));
    }, 6000);
    return () => clearInterval(interval);
  }, [capBP]);

  const handleCommand = (command: string) => {
    const newEntry = `tacitron:~$ ${command}`;
    setCommandHistory(prev => [...prev, newEntry]);
    
    if (command === 'exit') {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[
        styles.gameLayout,
        isLargeScreen && styles.gameLayoutLarge,
        isTablet && styles.gameLayoutTablet
      ]}>
        <View style={[
          styles.hudSection,
          isLargeScreen && styles.hudSectionLarge
        ]}>
          <ResourceHud 
            energy={142} 
            alloy={89} 
            power={2340} 
            seasonTier={12} 
          />
        </View>
        
        <View style={[
          styles.content,
          isLargeScreen && styles.contentLarge,
          isTablet && styles.contentTablet
        ]}>
          <View style={[
            styles.boardSection,
            isLargeScreen && styles.boardSectionLarge
          ]}>
            <BoardPreview />
          </View>
          
          <View style={[
            styles.gaugeSection,
            isLargeScreen && styles.gaugeSectionLarge
          ]}>
            <BandwidthGauge current={currentBP} max={capBP} />
          </View>
        </View>
        
        <View style={[
          styles.consoleSection,
          isLargeScreen && styles.consoleSectionLarge,
          isTablet && styles.consoleSectionTablet
        ]}>
          <CommandConsole 
            onCommand={handleCommand}
            commandHistory={commandHistory}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f11',
  },
  gameLayout: {
    flex: 1,
    flexDirection: 'column',
  },
  gameLayoutLarge: {
    flexDirection: 'row',
    padding: 20,
  },
  gameLayoutTablet: {
    padding: 12,
  },
  hudSection: {
    zIndex: 10,
  },
  hudSectionLarge: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 10 : 20,
  },
  contentLarge: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 20,
  },
  contentTablet: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  boardSection: {
    flex: isLargeScreen ? 2 : 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardSectionLarge: {
    marginRight: 20,
    maxWidth: '60%',
  },
  gaugeSection: {
    marginTop: isSmallScreen ? 20 : 30,
    alignItems: 'center',
  },
  gaugeSectionLarge: {
    flex: 1,
    marginTop: 0,
    marginLeft: 20,
    justifyContent: 'center',
    maxWidth: '40%',
  },
  consoleSection: {
    minHeight: isSmallScreen ? 100 : 120,
  },
  consoleSectionLarge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    minHeight: 140,
  },
  consoleSectionTablet: {
    minHeight: 130,
  },
}); 