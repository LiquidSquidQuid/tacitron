import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import ResourceHud from '../components/ResourceHud';
import BoardPreview from '../components/BoardPreview';
import BandwidthGauge from '../components/BandwidthGauge';
import CommandConsole from '../components/CommandConsole';

export default function PlayScreen() {
  const [currentBP, setCurrentBP] = useState(25);
  const capBP = 50;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBP(prev => Math.min(prev + 1, capBP));
    }, 6000);
    return () => clearInterval(interval);
  }, [capBP]);

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
      
      <CommandConsole />
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