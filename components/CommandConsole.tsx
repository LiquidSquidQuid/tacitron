import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';

const commands = ['deploy', 'scan', 'hub', 'pass', 'help', 'disconnect'];

interface CommandConsoleProps {
  onCommand?: (command: string) => void;
  commandHistory?: string[];
}

export default function CommandConsole({ onCommand, commandHistory = [] }: CommandConsoleProps) {
  return (
    <View style={styles.container}>
      {/* Command History */}
      <ScrollView style={styles.historyContainer} showsVerticalScrollIndicator={false}>
        {commandHistory.map((entry, index) => (
          <Text key={index} style={styles.historyText}>{entry}</Text>
        ))}
      </ScrollView>
      
      {/* Current Prompt */}
      <Text style={styles.prompt}>tacitron:~$</Text>
      
      {/* Command Buttons */}
      <View style={styles.commands}>
        {commands.map((cmd) => (
          <TouchableOpacity 
            key={cmd} 
            style={styles.command}
            onPress={() => onCommand?.(cmd)}
          >
            <Text style={styles.commandText}>{cmd}</Text>
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
  historyContainer: {
    maxHeight: 60,
    marginBottom: 8,
  },
  historyText: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 2,
    ...(Platform.OS !== 'web' && { fontFamily: 'monospace' }),
  },
  prompt: {
    color: '#3b82f6',
    fontSize: 14,
    marginBottom: 12,
    ...(Platform.OS !== 'web' && { fontFamily: 'monospace' }),
  },
  commands: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    ...(Platform.OS !== 'web' && { gap: 8 }),
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
    minWidth: 70,
    alignItems: 'center',
    flex: Platform.OS === 'web' ? 0 : 1,
    maxWidth: Platform.OS === 'web' ? 80 : undefined,
  },
  commandText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    ...(Platform.OS !== 'web' && { fontFamily: 'monospace' }),
  },
});