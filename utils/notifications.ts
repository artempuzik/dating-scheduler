import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DatingItem } from '../types/dating';

export const scheduleNotification = async (datingItem: DatingItem) => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return;
  }

  const [hours, minutes] = datingItem.time.split(':').map(Number);
  const [year, month, day] = datingItem.date.split('-').map(Number);
  
  const date = new Date(year, month - 1, day, hours, minutes);
  date.setHours(date.getHours() - 1); // Notify 1 hour before

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Upcoming Date!',
      body: `You have a date with ${datingItem.partnerName} in 1 hour!`,
      data: { datingItem },
    },
    trigger: {
      type: 'date',
      date,
    },
  });
};

export const cancelNotification = async (datingItem: DatingItem) => {
  await Notifications.cancelScheduledNotificationAsync(datingItem.id);
}; 