import { View, Text, StyleSheet, Platform } from 'react-native';

interface BandwidthGaugeProps {
  current: number;
  max: number;
}

export default function BandwidthGauge({ current, max }: BandwidthGaugeProps) {
  const progress = Math.min(current / max, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bandwidth</Text>
      <View style={styles.gauge}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.text}>{current}/{max} BP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  label: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
    ...(Platform.OS !== 'web' && { fontFamily: 'monospace' }),
  },
  gauge: {
    alignItems: 'center',
    ...(Platform.OS !== 'web' && { gap: 8 }),
  },
  track: {
    width: '100%',
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 4,
  },
  text: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
    marginTop: Platform.OS === 'web' ? 8 : 0,
    ...(Platform.OS !== 'web' && { fontFamily: 'monospace' }),
  },
});