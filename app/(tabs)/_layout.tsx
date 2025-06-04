import { Tabs } from 'expo-router';
import 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import {cancelNotification} from "@/utils/notifications";
import {useEffect} from "react";
import {getDailyNotificationId} from "@/utils/storage";

export default function RootLayout() {
    useEffect(() => {
        getDailyNotificationId().then(id => {
            if (!id) return
            cancelNotification(id)
        })
    }, []);
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
              name="tips"
              options={{
                  title: 'Tips',
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
