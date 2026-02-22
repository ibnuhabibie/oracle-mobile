import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases from 'react-native-purchases';
import * as Sentry from '@sentry/react-native';

import { MainNavigatorParamList } from '../../navigators/types';
import { COLORS } from '../../constants/colors';
import { useAsyncStorage } from '../../hooks/use-storage';

type WelcomeProps = NativeStackScreenProps<MainNavigatorParamList, 'Welcome'>;

type UserProfile = {
  email: string;
  is_email_verified: boolean;
  birth_date?: string;
  birth_time?: string;
  birth_city?: string;
  birth_country?: string;
  mbti_profile?: any;
};

type OtpVerificationParams = {
  email: string;
  shouldResendOtp: boolean;
};

const Welcome: React.FC<WelcomeProps> = ({ navigation }) => {
  const [opacity] = useState(new Animated.Value(0));
  const { getAuthToken, getUserProfile, sync } = useAsyncStorage();

  // Fallback timer to ensure navigation happens even if video fails
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      console.log('Fallback timer triggered - navigating anyway');
      Sentry.addBreadcrumb({
        category: 'video',
        message: 'Fallback timer triggered - navigating anyway',
        level: 'warning',
      });
      handleClick();
    }, 8000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleClick = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      console.log(customerInfo, 'customerInfo');

      const language = await AsyncStorage.getItem('language');
      const languageSelected = await AsyncStorage.getItem('language_selected');
      console.log(language, 'language');
      console.log(languageSelected, 'language_selected');

      if (language && languageSelected) {
        const auth_token = await getAuthToken();
        console.log(auth_token, 'auth_token');

        if (auth_token) {
          const profile = (await getUserProfile()) as UserProfile | null;
          console.log(profile, 'profile');

          const isProfileCompleted = (profile: UserProfile) => {
            return (
              profile.birth_date &&
              profile.birth_time &&
              profile.birth_city &&
              profile.birth_country
            );
          };

          if (profile && !profile.is_email_verified) {
            navigation.replace('OtpVerification', {
              email: profile.email,
              shouldResendOtp: true,
            } as OtpVerificationParams);
          } else if (profile && !isProfileCompleted(profile)) {
            navigation.replace('Onboarding');
          } else if (profile && !profile.mbti_profile) {
            navigation.replace('MbtiQuiz');
          } else if (profile) {
            navigation.replace('Tabs');
          } else {
            await sync()
            navigation.replace('Tabs');
          }
        } else {
          navigation.replace('SignIn');
        }
      } else {
        navigation.replace('LanguageSelection');
      }


    } catch (error) {
      console.log(error);
      navigation.replace('LanguageSelection');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.videoWrapper, { opacity }]}>
        <Video
          source={require('../../assets/splash-screen.mp4')}
          style={styles.video}
          resizeMode="cover"
          controls={false}
          repeat={false}
          paused={false}
          muted={true}
          pointerEvents="none"
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          onLoad={fadeIn}
          onError={(error) => {
            console.log('Video error:', error);
            Sentry.captureException(error);
            Sentry.addBreadcrumb({
              category: 'video',
              message: 'Video playback error',
              level: 'error',
            });
            handleClick();
          }}
          onPlaybackStateChanged={(state) => {
            console.log('Video playback state:', state);
            Sentry.addBreadcrumb({
              category: 'video',
              message: `Playback state: ${state}`,
              level: 'info',
            });
          }}
          onEnd={() => setTimeout(handleClick, 1000)}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  videoWrapper: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.black,
    zIndex: 100,
  },
});

export default Welcome;
