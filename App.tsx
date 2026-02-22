import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import {enableScreens} from 'react-native-screens';
import notifee, {EventType} from '@notifee/react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {getMessaging, onMessage} from '@react-native-firebase/messaging';
import {getApp} from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dimensions} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Purchases from 'react-native-purchases';

import {REVENUECAT_KEY} from '@env';

import MainNavigator from './src/navigators/main-navigator';
import api from './src/utils/http';
import {navigationRef, navigate} from './src/navigators/navigation-ref';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://9a9910632f674db864c3d61d51a0ffd4@o4510930949242880.ingest.de.sentry.io/4510930951471184',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

enableScreens(true);

const App: React.FC = () => {
  const handleNotif = async notifData => {
    const response = await api.get(`/v1/usage-histories/${notifData.trx_no}`);
    const item = response.data;

    let data = JSON.parse(item.response_data);
    let payload = {};
    let pageName = '';

    if (item.service_type == 'personalized_love_forecast_12mth') {
      pageName = 'LoveReportResult';
      payload = {result: data, job_id: notifData.job_id};
    } else if (item.service_type == 'ask_any_question') {
      pageName = 'AffinityResults';
      payload = {
        question: data.question,
        affinityResult: {data},
      };
    } else if (item.service_type == 'transit_report') {
      pageName = 'FortuneReportResult';
      payload = {result: data, job_id: notifData.job_id};
    } else if (item.service_type == 'relationship_compatibility') {
      pageName = 'RelationReportResult';
      payload = {
        result: data,
        love_profile: JSON.parse(item.request_data).partner,
        job_id: notifData.job_id,
      };
    } else if (item.service_type == 'ask_secret_diary') {
      pageName = 'EchoDetail';
      payload = {
        id: data.id,
        date: {
          dateString: data.date,
        },
      };
    }

    console.log(pageName, payload);

    navigate(pageName, payload);
  };

  useEffect(() => {
    console.log('triggered');

    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    if (REVENUECAT_KEY) {
      Purchases.configure({apiKey: REVENUECAT_KEY, useAmazon: false});
    } else {
      console.error('REVENUECAT_KEY is not set');
    }

    const init = async () => {
      try {
        const settings = await notifee.requestPermission();
        console.log(
          'Notification permission status:',
          settings.authorizationStatus,
        );

        const dataString = await AsyncStorage.getItem('pendingNotificationTap');
        if (dataString) {
          const notifData = JSON.parse(dataString);
          handleNotif(notifData);
          await AsyncStorage.removeItem('pendingNotificationTap');
        }
      } catch (error) {
        console.log(error, 'app');
      }
    };

    init();

    notifee.getInitialNotification().then(initialNotification => {
      console.log(initialNotification);

      if (initialNotification) {
        console.log(
          'App opened from quit state via notification',
          initialNotification,
        );
        const {data} = initialNotification.notification;
        handleNotif(data);
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribeNotifee = notifee.onForegroundEvent(
      async ({type, detail}) => {
        if (type === EventType.PRESS) {
          console.log('User tapped notification (FOREGROUND):', detail);

          const notifData = detail.notification?.data;
          handleNotif(notifData);
        }
      },
    );

    const unsubscribeMessage = onMessage(
      getMessaging(getApp()),
      async remoteMessage => {
        console.log('Message received in foreground:', remoteMessage);

        let title = '';
        let body = '';
        if (
          remoteMessage.data &&
          typeof remoteMessage.data.title === 'string' &&
          typeof remoteMessage.data.body === 'string'
        ) {
          title = remoteMessage.data.title;
          body = remoteMessage.data.body;
        }

        console.log(title, body, remoteMessage.data);

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
              pressAction: {id: 'default'},
            },
            data: remoteMessage.data,
          });
        } catch (error) {
          console.log(error);
        }
      },
    );

    return () => {
      unsubscribeNotifee();
      unsubscribeMessage();
    };
  }, []);

  // Get current route name from navigationRef
  const [currentRoute, setCurrentRoute] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const unsubscribe = navigationRef?.addListener?.('state', () => {
      const route = navigationRef?.getCurrentRoute?.();
      setCurrentRoute(route?.name);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const onNavigationReady = () => {
    console.log('Navigation ready');
    const route = navigationRef?.getCurrentRoute?.();
    setCurrentRoute(route?.name);
  };

  const appContent = (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <NavigationContainer
          ref={navigationRef}
          detachInactiveScreens={true}
          onReady={onNavigationReady}>
          <MainNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
      <Toast />
    </GestureHandlerRootView>
  );

  return appContent;
};

export default Sentry.wrap(App);
