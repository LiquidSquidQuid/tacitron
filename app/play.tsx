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
    
    if (command === 'disconnect') {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <ResourceHud 
        energy={142} 
        alloy={89} 
        power={2340} 
        seasonTier={12} 
      />
      
      <View style={styles.content}>
        <BoardPreview />
        <BandwidthGauge current={currentBP} max={capBP} />
      </View>
      
      <CommandConsole 
        onCommand={handleCommand}
        commandHistory={commandHistory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f11',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
}); 