import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import HomeIcon from '../components/icons/home-icon';
import ProfileIcon from '../components/icons/profile/profile-icon';
import EchoIcon from '../components/icons/echo/echo-icon';

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
import Profile from '../screens/main/profile/profile';
import PurchaseHistory from '../screens/main/history/purchase-history';
import DailyProfileDetail from '../screens/main/profile/daily-profile-detail';

import ComponentGallery from '../screens/dev/component-gallery';
import AskAffinityIcon from '../components/icons/ask-affinity/ask-affinity-icon';
import WebviewContent from '../screens/main/webview-content';
import AskAffinity from '../screens/main/service/affinity/ask-affinity';
import AffinityResults from '../screens/main/service/affinity/affinity-results';
import Echo from '../screens/main/service/echo/echo';
import EchoDetail from '../screens/main/service/echo/echo-detail';
import LoveForecast from '../screens/main/service/love-forecast/love-forecast';
import RelationReport from '../screens/main/service/relation-report/relation-report';
import FortuneReport from '../screens/main/service/fortune-report/fortune-report';
import Topup from '../screens/main/topup';
import LoveReportResult from '../screens/main/service/love-forecast/love-report-result';
import FortuneReportResult from '../screens/main/service/fortune-report/fortune-report-result';
import RelationReportResult from '../screens/main/service/relation-report/relation-report-result';
import { COLORS } from '../constants/colors';
import StarMeteorBackground from '../components/star-meteor-background';
import type { MainNavigatorParamList } from './types';

import { scaleFont, scaleSize } from '../utils/scale';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator<MainNavigatorParamList>();
const Stack = createNativeStackNavigator<MainNavigatorParamList>();

const TabNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#121010',
          height: scaleSize(56, 50, 76),
          alignItems: 'center',
          borderTopWidth: 0,
          borderColor: 'transparent',
        },
        sceneStyle: {
          backgroundColor: 'black'
        },
        // tabBarActiveTintColor: '#000',
        // tabBarInactiveTintColor: '#999',
        tabBarIconStyle: {
          // marginTop: scaleSize(4, 2, 8),
          marginTop: 0,
        },
        tabBarLabelStyle: {
          color: COLORS.white,
          // marginTop: scaleSize(2, 1, 6),
          fontSize: scaleFont(12, 6, 16)
        },
      }}
      initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <HomeIcon size={scaleSize(19, 16, 24)} fill={focused} />
          ),
          tabBarLabel: t('bottomBar.home'),
        }}
      />
      <Tab.Screen
        name="Echo"
        component={Echo}
        options={{
          tabBarIcon: ({ focused }) => (
            <EchoIcon size={scaleSize(19, 16, 24)} fill={focused} />
          ),
          tabBarLabel: t('bottomBar.echo'),
        }}
      />
      <Tab.Screen
        name="AskAffinity"
        component={AskAffinity}
        options={{
          tabBarIcon: ({ focused }) => (
            <AskAffinityIcon size={scaleSize(19, 16, 24)} fill={focused} />
          ),
          tabBarLabel: t('bottomBar.askAffinity'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <ProfileIcon size={scaleSize(19, 16, 24)} fill={focused} />
          ),
          tabBarLabel: t('bottomBar.profile'),
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'black' },
        animation: 'fade_from_bottom'
      }}
      initialRouteName='Welcome'>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="OtpSuccess" component={OtpSuccess} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="MbtiQuiz" component={MbtiQuiz} />

      <Stack.Screen name="ComponentGallery" component={ComponentGallery} />

      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="EchoDetail" component={EchoDetail} />
      <Stack.Screen name="AffinityResults" component={AffinityResults} />

      <Stack.Screen name="FortuneReport" component={FortuneReport} />
      <Stack.Screen name="FortuneReportResult" component={FortuneReportResult} />

      <Stack.Screen name="RelationReport" component={RelationReport} />
      <Stack.Screen name="RelationReportResult" component={RelationReportResult} />

      <Stack.Screen name="LoveForecast" component={LoveForecast} />
      <Stack.Screen name="LoveReportResult" component={LoveReportResult} />

      <Stack.Screen name="WebviewContent" component={WebviewContent} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="PasswordSetting" component={PasswordSetting} />
      <Stack.Screen name="PurchaseHistory" component={PurchaseHistory} />
      <Stack.Screen name="TopUp" component={Topup} />

      <Stack.Screen name="MbtiResults" component={MbtiResults} />
      <Stack.Screen name="AstrologyResults" component={AstrologyResults} />
      <Stack.Screen name="BaziResults" component={BaziResults} />
      <Stack.Screen name="DailyProfileDetail" component={DailyProfileDetail} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
