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
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        }}
      >
        <Stack.Screen name="play" options={{ headerShown: false }} />
      </Stack>
      {Platform.OS !== 'web' && <Toast />}
    </>
  );
}
