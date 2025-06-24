import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../utils/http';
import HomeIcon from '../components/icons/Home';
import ProfileIcon from '../components/icons/Profile';
import EchoIcon from '../components/icons/Echo';

import Onboarding from '../screens/auth/onboarding';
import LanguageSelection from '../screens/auth/language-selection';
import MbtiQuiz from '../screens/auth/mbti-quiz';
import Welcome from '../screens/auth/welcome';
import OtpSuccess from '../screens/auth/otp-success';
import OtpVerification from '../screens/auth/otp-verification';
import SignIn from '../screens/auth/signin';
import SignUp from '../screens/auth/signup';

import Home from '../screens/main/home';
import AstrologyResults from '../screens/main/profile/astrology-results';
import BaziResults from '../screens/main/profile/bazi-results';
import EditProfile from '../screens/main/profile/edit-profile';
import MbtiResults from '../screens/main/profile/mbti-results';
import PasswordSetting from '../screens/main/profile/password-setting';
import PrivacyPolicy from '../screens/main/profile/privacy-policy';
import Profile from '../screens/main/profile/profile';
import PurchaseHistory from '../screens/main/profile/purchase-history';

import ComponentGallery from '../screens/dev/component-gallery';
import AskAffinityIcon from '../components/icons/ask-affinity';
import WebviewContent from '../screens/main/webview-content';
import AskAffinity from '../screens/main/service/affinity/ask-affinity';
import AffinityResults from '../screens/main/service/affinity/affinity-results';
import Echo from '../screens/main/service/echo/echo';
import EchoDetail from '../screens/main/service/echo/echo-detail';
import LoveForecast from '../screens/main/service/love-forecast/love-forecast';
import RelationReport from '../screens/main/service/relation-report/relation-report';
import FortuneReport from '../screens/main/service/fortune-report/fortune-report';
import Topup from '../screens/main/topup';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#ffffff' },
      tabBarActiveTintColor: '#000',
      tabBarInactiveTintColor: '#999',
    }}
    initialRouteName="Home">
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({ size, focused }) => (
          <HomeIcon size={size ?? 19} fill={focused} />
        ),
        tabBarLabel: 'Home',
      }}
    />
    <Tab.Screen
      name="Echo"
      component={Echo}
      options={{
        tabBarIcon: ({ size, focused }) => (
          <EchoIcon size={size ?? 19} fill={focused} />
        ),
        tabBarLabel: 'Echo',
      }}
    />
    <Tab.Screen
      name="AskAffinity"
      component={AskAffinity}
      options={{
        tabBarIcon: ({ size, focused }) => (
          <AskAffinityIcon size={size ?? 19} fill={focused} />
        ),
        tabBarLabel: 'Ask Affinity',
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarIcon: ({ size, focused }) => (
          <ProfileIcon size={size ?? 19} fill={focused} />
        ),
        tabBarLabel: 'Profile',
      }}
    />
  </Tab.Navigator>
);

const MainNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [routeParams, setRouteParams] = useState<any>(null);

  useEffect(() => {
    const checkAuthState = async () => {
      const auth_token = await AsyncStorage.getItem('auth_token');

      if (!auth_token) {
        setInitialRoute('Welcome');
        return;
      }

      try {
        const res = await api.get('/v1/users/me')
        const profile = res.data
        await AsyncStorage.setItem('user_profile', JSON.stringify(profile));

        const isProfileCompleted = (profile: any) => {
          return (
            profile.birth_date &&
            profile.birth_time &&
            profile.birth_city &&
            profile.birth_country
          );
        };

        if (!profile.is_email_verified) {
          setInitialRoute('OtpVerification');
          setRouteParams({
            email: profile.email,
            shouldResendOtp: true,
          });
        } else if (!isProfileCompleted(profile)) {
          setInitialRoute('Onboarding');
        } else if (!profile.mbti_profile) {
          setInitialRoute('MbtiQuiz');
        } else {
          setInitialRoute('Tabs');
        }
      } catch (err) {
        await AsyncStorage.removeItem('auth_token');
        setInitialRoute('Welcome');
      }
    };

    checkAuthState();
  }, []);

  if (!initialRoute) return null; // or show splash screen

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerification}
        initialParams={routeParams} />
      <Stack.Screen name="OtpSuccess" component={OtpSuccess} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="MbtiQuiz" component={MbtiQuiz} />

      <Stack.Screen name="ComponentGallery" component={ComponentGallery} />

      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="EchoDetail" component={EchoDetail} />
      <Stack.Screen name="AffinityResults" component={AffinityResults} />

      <Stack.Screen name="FortuneReport" component={FortuneReport} />
      <Stack.Screen name="RelationReport" component={RelationReport} />
      <Stack.Screen name="LoveForecast" component={LoveForecast} />


      <Stack.Screen name="WebviewContent" component={WebviewContent} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="PasswordSetting" component={PasswordSetting} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="PurchaseHistory" component={PurchaseHistory} />
      <Stack.Screen name="TopUp" component={Topup} />

      <Stack.Screen name="MbtiResults" component={MbtiResults} />
      <Stack.Screen name="AstrologyResults" component={AstrologyResults} />
      <Stack.Screen name="BaziResults" component={BaziResults} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
