import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions } from 'react-native';
import { useState, useRef } from 'react';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;
const isLargeScreen = width >= 1024;

const commands = ['deploy', 'scan', 'hub', 'pass', 'help', 'exit'];

interface CommandConsoleProps {
  onCommand?: (command: string) => void;
  commandHistory?: string[];
}

export default function CommandConsole({ onCommand, commandHistory = [] }: CommandConsoleProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    setScrollPosition(contentOffset.y);
    setContentHeight(contentSize.height);
    setContainerHeight(layoutMeasurement.height);
  };

  const showScrollIndicator = contentHeight > containerHeight;
  const scrollRatio = containerHeight / contentHeight;
  const thumbHeight = Math.max(scrollRatio * containerHeight, 20);
  const thumbPosition = (scrollPosition / (contentHeight - containerHeight)) * (containerHeight - thumbHeight);
  return (
    <View style={[
      styles.container,
      isLargeScreen && styles.containerLarge
    ]}>
      {/* Command History */}
      <View style={styles.historyWrapper}>
        <ScrollView 
          ref={scrollViewRef}
          style={[
            styles.historyContainer,
            isLargeScreen && styles.historyContainerLarge
          ]} 
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {commandHistory.map((entry, index) => (
            <Text key={index} style={[
              styles.historyText,
              isLargeScreen && styles.historyTextLarge
            ]}>{entry}</Text>
          ))}
        </ScrollView>
        
        {/* Custom Scroll Indicator */}
        {showScrollIndicator && (
          <View style={styles.scrollIndicatorTrack}>
            <View 
              style={[
                styles.scrollIndicatorThumb,
                {
                  height: thumbHeight,
                  top: thumbPosition,
                }
              ]} 
            />
          </View>
        )}
      </View>
      
      {/* Current Prompt */}
      <Text style={[
        styles.prompt,
        isLargeScreen && styles.promptLarge
      ]}>tacitron:~$</Text>
      
      {/* Command Buttons */}
      <View style={[
        styles.commands,
        isLargeScreen && styles.commandsLarge
      ]}>
        {commands.map((cmd) => (
          <TouchableOpacity 
            key={cmd} 
            style={[
              styles.command,
              isLargeScreen && styles.commandLarge
            ]}
            onPress={() => onCommand?.(cmd)}
          >
            <Text style={[
              styles.commandText,
              isLargeScreen && styles.commandTextLarge
            ]}>{cmd}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0b',
    borderTopWidth: 1,
    borderTopColor: '#2a2a2e',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 120,
  },
  containerLarge: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 140,
    borderRadius: 8,
    margin: 8,
  },
  historyContainer: {
    flex: 1,
  },
  historyContainerLarge: {
    flex: 1,
  },
  historyText: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 2,
    ...(Platform.OS !== 'web' && { fontFamily: 'monospace' }),
  },
  historyTextLarge: {
    fontSize: 14,
    marginBottom: 3,
  },
  prompt: {
    color: '#00ff88',
    fontSize: 14,
    marginBottom: 12,
    ...(Platform.OS !== 'web' && { 
      fontFamily: 'monospace',
      textShadowColor: '#00ff88',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 3,
    }),
  },
  promptLarge: {
    fontSize: 16,
    marginBottom: 16,
  },
  commands: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    ...(Platform.OS !== 'web' && { gap: 8 }),
  },
  commandsLarge: {
    justifyContent: 'space-around',
    ...(Platform.OS !== 'web' && { gap: 12 }),
  },
  command: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1f2937',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#374151',
    marginRight: Platform.OS === 'web' ? 4 : 0,
    marginBottom: Platform.OS === 'web' ? 4 : 0,
    minWidth: isSmallScreen ? 60 : 70,
    alignItems: 'center',
    flex: Platform.OS === 'web' ? 0 : 1,
    maxWidth: Platform.OS === 'web' ? (isLargeScreen ? 100 : 80) : undefined,
  },
  commandLarge: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    minWidth: 90,
  },
  commandText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    ...(Platform.OS !== 'web' && { fontFamily: 'monospace' }),
  },
  commandTextLarge: {
    fontSize: 14,
    fontWeight: '600',
  },
  historyWrapper: {
    position: 'relative',
    maxHeight: isLargeScreen ? 80 : 60,
    marginBottom: isLargeScreen ? 12 : 8,
  },
  scrollIndicatorTrack: {
    position: 'absolute',
    right: 2,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#374151',
    borderRadius: 1.5,
  },
  scrollIndicatorThumb: {
    position: 'absolute',
    right: 0,
    width: 3,
    backgroundColor: '#00ff88',
    borderRadius: 1.5,
    minHeight: 20,
  },
});