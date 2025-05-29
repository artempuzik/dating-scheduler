import { Tabs } from 'expo-router';
import 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
      <Tabs
          screenOptions={{
              tabBarActiveTintColor: 'rgba(232,80,255,0.98)',
              tabBarInactiveTintColor: '#628af3',
              tabBarStyle: {
                  borderTopWidth: 1,
                  borderTopColor: '#ddd',
              },
              headerTitleStyle: {
                  fontWeight: 'bold',
                  color: 'rgba(232,80,255,0.98)',
              },
          }}
      >
          <Tabs.Screen
              name="dating-list"
              options={{
                  title: 'Dating List',
                  tabBarIcon: ({ color, size }) => (
                      <Ionicons name="calendar" size={size} color={color} />
                  ),
                  headerShown: true,
              }}
          />
          <Tabs.Screen
              name="compatibility"
              options={{
                  title: 'Compatibility',
                  tabBarIcon: ({ color, size }) => (
                      <Ionicons name="heart" size={size} color={color} />
                  ),
                  headerShown: true,
              }}
          />
          <Tabs.Screen
              name="profile"
              options={{
                  title: 'Profile',
                  tabBarIcon: ({ color, size }) => (
                      <Ionicons name="person" size={size} color={color} />
                  ),
                  headerShown: true,
              }}
          />
          <Tabs.Screen
              name="dating-form"
              options={{
                  title: 'Dating Form',
                  tabBarIcon: ({ color, size }) => (
                      <Ionicons name="document" size={size} color={color} />
                  ),
                  headerShown: true,
              }}
          />
      </Tabs>
  );
}
