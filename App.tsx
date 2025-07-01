import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import notifee, { EventType } from '@notifee/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthProvider } from './src/context/auth-context';
import { NotificationProvider, useNotification } from './src/context/notification-context';
import MainNavigator from './src/navigators/main-navigator';
import { FloatingPreviewButton } from './src/features/component-preview/floating-preview-button';
import api from './src/utils/http';
import { navigationRef, navigate } from './src/navigators/navigation-ref';


enableScreens(true);

const App: React.FC = () => {

  const handleNotif = async (notifData) => {
    const response = await api.get(`/v1/usage-histories/${notifData.job_id}`);
    const item = response.data

    let data = JSON.parse(item.response_data)
    let payload = {}
    let pageName = ''

    if (item.service_type == 'personalized_love_forecast_12mth') {
      pageName = 'LoveReportResult'
      payload = { result: data }
    } else if (item.service_type == 'ask_any_question') {
      pageName = 'AffinityResults'  
      payload = {
        question: data.question,
        affinityResult: { data }
      }
    } else if (item.service_type == 'transit_report') {
      pageName = 'FortuneReportResult'
      payload = { result: data }
    } else if (item.service_type == 'relationship_compatibility') {
      pageName = 'RelationReportResult'
      payload = {
        result: data,
        love_profile: JSON.parse(item.request_data).partner
      }
    } else if (item.service_type == 'ask_secret_diary') {
      pageName = 'EchoDetail'
      payload = {
        id: data.id,
        date: {
          dateString: data.date
        }
      }
    }

    console.log(pageName, payload)

    navigate(pageName, payload)
  }

  useEffect(() => {
    console.log('triggered')

    const init = async () => {
      try {
        const settings = await notifee.requestPermission();
        console.log('Notification permission status:', settings.authorizationStatus);

        const dataString = await AsyncStorage.getItem('pendingNotificationTap');
        if (dataString) {
          const notifData = JSON.parse(dataString);
          handleNotif(notifData)
          await AsyncStorage.removeItem('pendingNotificationTap');
        }
      } catch (error) {
        console.log(error, 'app')
      }
    }

    init()

    notifee.getInitialNotification().then(initialNotification => {
      console.log(initialNotification)

      if (initialNotification) {
        console.log('App opened from quit state via notification', initialNotification);
        const { data } = initialNotification.notification;
        handleNotif(data)
      }
    });
  }, []);

  useEffect(() => {

    const unsubscribeNotifee = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('User tapped notification (FOREGROUND):', detail);

        const notifData = detail.notification?.data;
        handleNotif(notifData)
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
      <NavigationContainer ref={navigationRef}>
        <MainNavigator />
        <FloatingPreviewButton />
      </NavigationContainer>
      {/* </AuthProvider> */}
      {/* </NotificationProvider> */}
    </GestureHandlerRootView>
  );
};

export default App;
