import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import notifee, { EventType } from '@notifee/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';


import { AuthProvider } from './src/context/auth-context';
import { NotificationProvider, useNotification } from './src/context/notification-context';
import MainNavigator from './src/navigators/main-navigator';
import { FloatingPreviewButton } from './src/features/component-preview/floating-preview-button';

enableScreens(true);

const App: React.FC = () => {
  useEffect(() => {
    console.log('triggered')

    notifee.getInitialNotification().then(initialNotification => {
      console.log(initialNotification)

      if (initialNotification) {
        console.log('App opened from quit state via notification', initialNotification);
        const { data } = initialNotification.notification;
      }
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      const settings = await notifee.requestPermission();
      console.log('Notification permission status:', settings.authorizationStatus);
    }

    init()

    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('User tapped notification (FOREGROUND):', detail);

        const data = detail.notification?.data;
        if (data?.screen === 'Details') {
          // Example navigation if you’re using navigation ref
          // navigationRef.current?.navigate('Details', { id: data.id });
          console.log('Navigate to Details screen with ID:', data.id);
        }
      }
    });

    const unsubscribeMessage = onMessage(getMessaging(getApp()), async remoteMessage => {
      console.log('Message received in foreground:', remoteMessage);

      const { title, body } = remoteMessage.data;

      console.log(title, body, remoteMessage.data)

      try {
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });

        await notifee.displayNotification({
          title,
          body,
          android: {
            channelId: 'default',
            pressAction: { id: 'default' },
          },
          data: remoteMessage.data,
        });
      } catch (error) {
        console.log(error)
      }
    });

    return () => {
      unsubscribeNotifee();
      unsubscribeMessage();
    };
  }, []);


  return (
    <GestureHandlerRootView>
      {/* <NotificationProvider> */}
      {/* <AuthProvider> */}
      <NavigationContainer>
        <MainNavigator />
        <FloatingPreviewButton />
      </NavigationContainer>
      {/* </AuthProvider> */}
      {/* </NotificationProvider> */}
    </GestureHandlerRootView>
  );
};

export default App;
