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
          <Text style={styles.text}>{current}/{max} BP</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
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
    width: 240, // Match board width
  },
  track: {
    width: 240, // Match board width exactly
    height: 24,
    backgroundColor: '#374151',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 6,
  },
  text: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
    position: 'absolute',
    zIndex: 1,
    textAlign: 'center',
    ...(Platform.OS !== 'web' && { fontFamily: 'monospace' }),
  },
});