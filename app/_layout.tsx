import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import 'react-native-reanimated';
import {useEffect, useState} from 'react';
import * as Notifications from 'expo-notifications';
import LandingScreen from "@/app/landing";
import * as Linking from 'expo-linking';

export const theme = {
    dark: false,
    colors: DefaultTheme.colors,
    fonts: DefaultTheme.fonts,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();
  const [isAccepted, setIsAccepted] = useState(true);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    };

    requestPermissions();

    // Handle notification response
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const url = response.notification.request.content.data?.url;
      if (url && typeof url === 'string') {
        Linking.openURL(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!loaded) {
    return null;
  }

  if (isAccepted) {
    return (
        <ThemeProvider value={DefaultTheme}>
          <LandingScreen setIsAccepted={setIsAccepted}/>
        </ThemeProvider>
    );
  }

  return (
      <ThemeProvider value={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    </ThemeProvider>
  );
}
