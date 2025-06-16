import { Stack } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f0f11',
          },
          headerTintColor: '#00ff88',
          headerTitleStyle: {
            fontWeight: 'bold',
            ...(Platform.OS !== 'web' && { letterSpacing: 2 }),
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth-confirmed" options={{ headerShown: false }} />
        <Stack.Screen name="play" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
}
