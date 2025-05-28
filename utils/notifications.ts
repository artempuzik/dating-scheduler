import * as Notifications from 'expo-notifications';
import { DatingItem } from '@/types/dating';
import {Alert} from "react-native";

export const scheduleNotification = async (datingItem: DatingItem) => {
  try {
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
    date.setMinutes(date.getMinutes() - 1);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Upcoming Date!',
        body: `You have a date with ${datingItem.partnerName} in 1h!`,
        data: { datingItem },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Upcoming Date!',
        body: `Congratulations!!! You have a date with ${datingItem.partnerName} in ${datingItem.date} at ${datingItem.time}!`,
        data: { datingItem },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
      },
    });
  } catch (error) {
    console.error('Error canceling scheduled notification:', error);
    throw error;
  }
};

export const cancelNotification = async (datingItem: DatingItem) => {
  await Notifications.cancelScheduledNotificationAsync(datingItem.id);
}; 