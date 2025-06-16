import { View, Text, StyleSheet, Platform } from 'react-native';

interface ResourceHudProps {
  energy: number;
  alloy: number;
  power: number;
  seasonTier: number;
}

export default function ResourceHud({ energy, alloy, power, seasonTier }: ResourceHudProps) {
  return (
    <View style={styles.container}>
      <View style={styles.metric}>
        <Text style={styles.label}>ENERGY</Text>
        <Text style={styles.value}>{energy}</Text>
      </View>
      <View style={styles.metric}>
        <Text style={styles.label}>ALLOY</Text>
        <Text style={styles.value}>{alloy}</Text>
      </View>
      <View style={styles.metric}>
        <Text style={styles.label}>POWER</Text>
        <Text style={styles.value}>{power}</Text>
      </View>
      <View style={styles.metric}>
        <Text style={styles.label}>TIER</Text>
        <Text style={styles.value}>{seasonTier}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#161618',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2e',
  },
  metric: {
    alignItems: 'center',
    ...(Platform.OS !== 'web' && { gap: 4 }),
  },
  label: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: Platform.OS === 'web' ? 4 : 0,
    ...(Platform.OS !== 'web' && { fontFamily: 'monospace' }),
  },
  value: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
    ...(Platform.OS !== 'web' && { fontFamily: 'monospace' }),
  },
});