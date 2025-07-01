/**
 * @format
 */

import { AppRegistry } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import App from './App';
import { name as appName } from './app.json';

// Register headless task for background/quit-state FCM handling
import { getApp } from '@react-native-firebase/app';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

setBackgroundMessageHandler(getMessaging(getApp()), async remoteMessage => {
    console.log('Background message received:', remoteMessage);
    const { title, body, pressActionId } = remoteMessage.data || {};
    await notifee.displayNotification({
        title: title || 'Default Title',
        body: body || '',
        android: {
            channelId: 'default',
            pressAction: {
                id: pressActionId || 'default',
            },
        },
        data: message.data
    });
    // You can trigger local Notifee notification here too if needed
});

// ✅ Handle background notification tap
notifee.onBackgroundEvent(async ({ type, detail }) => {
    try {
        console.log('(BACKGROUND)', detail, type);
        if (type === EventType.PRESS) {
            console.log('User pressed the notification (BACKGROUND)', detail);
            await AsyncStorage.setItem('pendingNotificationTap', JSON.stringify(detail.notification?.data));
            console.log('storage setup');
        }
    } catch (error) {
        console.log(error, 'error')
    }
});

// if (!global.__headlessTaskRegistered) {
// ✅ Required by Firebase for background messages
AppRegistry.registerHeadlessTask('ReactNativeFirebaseMessagingHeadlessTask', () => async (message) => {
    // Handle silent push / data-only messages here
    console.log('Received background FCM message:', message);

    const { title, body, pressActionId } = message.data || {};

    await notifee.displayNotification({
        title: title || 'Default Title',
        body: body || '',
        android: {
            channelId: 'default',
            pressAction: {
                id: pressActionId || 'default',
            },
        },
        data: message.data
    });
});

// global.__headlessTaskRegistered = true;
// }



AppRegistry.registerComponent(appName, () => App);
