import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

const commands = ['deploy', 'scan', 'hub', 'pass', 'help'];

export default function CommandConsole() {
  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>tacitron:~$</Text>
      <View style={styles.commands}>
        {commands.map((cmd) => (
          <TouchableOpacity key={cmd} style={styles.command}>
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
    ...(Platform.OS !== 'web' && { gap: 8 }),
  },
  command: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1f2937',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#374151',
    marginRight: Platform.OS === 'web' ? 8 : 0,
    marginBottom: Platform.OS === 'web' ? 8 : 0,
  },
  commandText: {
    color: '#e5e7eb',
    fontSize: 12,
    ...(Platform.OS !== 'web' && { fontFamily: 'monospace' }),
  },
});