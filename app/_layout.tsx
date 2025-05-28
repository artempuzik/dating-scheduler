import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';

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

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    };

    requestPermissions();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const keitaroScript = `
    <script>
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-XXXXXXX');
    </script>
  `;

  return (
    <ThemeProvider value={DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: 'Welcome',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="dating-list"
            options={{
              title: 'Dating List',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="dating-form"
            options={{
              title: 'Add/Edit Date',
              headerShown: true,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
        {/*<WebView*/}
        {/*  source={{ html: keitaroScript }}*/}
        {/*  style={{ width: 0, height: 0 }}*/}
        {/*  scrollEnabled={false}*/}
        {/*  onError={(syntheticEvent) => {*/}
        {/*    const { nativeEvent } = syntheticEvent;*/}
        {/*    console.warn('WebView error: ', nativeEvent);*/}
        {/*  }}*/}
        {/*/>*/}
      </View>
    </ThemeProvider>
  );
}
