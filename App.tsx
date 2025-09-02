import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { enableScreens } from 'react-native-screens';
import notifee, { EventType } from '@notifee/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StripeProvider } from '@stripe/stripe-react-native';

import MainNavigator from './src/navigators/main-navigator';
import api from './src/utils/http';
import { navigationRef, navigate } from './src/navigators/navigation-ref';
import StarMeteorBackground from './src/components/star-meteor-background';
import { Dimensions, StyleSheet, View } from 'react-native';
import RadialGradient from 'react-native-radial-gradient';

const { width, height } = Dimensions.get('window');


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
            pressAction: { id: 'default' },
          },
          data: remoteMessage.data,
        });
      } catch (error) {
        console.log(error);
      }
    });

    return () => {
      unsubscribeNotifee();
      unsubscribeMessage();
    };
  }, []);


  // Get current route name from navigationRef
  const [currentRoute, setCurrentRoute] = useState<string | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = navigationRef?.addListener?.('state', () => {
      const route = navigationRef?.getCurrentRoute?.();
      setCurrentRoute(route?.name);
    });
    // Set initial route
    const route = navigationRef?.getCurrentRoute?.();
    setCurrentRoute(route?.name);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const appContent = (
    <GestureHandlerRootView>
      <StripeProvider
        publishableKey="pk_test_51PVG0tIYVaNsBhG4lSzSsK0Aytevy88pZWHAEyeRTOx8I8sJzF954qzrvsEIaHlnoKoixSZpm427IEptSgbKYGGF00A4eoUNga"
      >
        <NavigationContainer ref={navigationRef}>
          <View style={{ backgroundColor: 'black', flex: 1 }}>
            <RadialGradient
              style={StyleSheet.absoluteFill}
              colors={['#161C41', '#161313']}
              center={[width / 2, height / 2]}
              radius={Math.max(width, height) / 1.2}
            />
            <MainNavigator />
          </View>
          {/* <FloatingPreviewButton /> */}
        </NavigationContainer>
      </StripeProvider>
      <Toast />
    </GestureHandlerRootView>
  );

  return appContent;
};

export default App;
