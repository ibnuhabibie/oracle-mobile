import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import HomeIcon from '../components/icons/Home';
import ProfileIcon from '../components/icons/Profile';

import Introduction from '../screens/auth/Introduction';
import LanguageSelection from '../screens/auth/LanguageSelection';
import MbtiQuiz from '../screens/auth/MbtiQuiz';
import Welcome from '../screens/auth/Welcome';
import OtpSuccess from '../screens/auth/OtpSuccess';
import OtpVerification from '../screens/auth/OtpVerification';
import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import Home from '../screens/main/Home';
import AstrologyResults from '../screens/main/profile/AstrologyResults';
import BaziResults from '../screens/main/profile/BaziResults';
import EditProfile from '../screens/main/profile/EditProfile';
import MbtiResults from '../screens/main/profile/MbtiResults';
import PasswordSetting from '../screens/main/profile/PasswordSetting';
import PrivacyPolicy from '../screens/main/profile/PrivacyPolicy';
import Profile from '../screens/main/profile/Profile';
import PurchaseHistory from '../screens/main/profile/PurchaseHistory';
import ComponentGallery from '../screens/dev/ComponentGallery';

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
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Otp" component={OtpVerification} />
      <Stack.Screen name="OtpSuccess" component={OtpSuccess} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
      <Stack.Screen name="Introduction" component={Introduction} />
      <Stack.Screen name="MbtiQuiz" component={MbtiQuiz} />
      <Stack.Screen name="MbtiResults" component={MbtiResults} />
      <Stack.Screen name="ComponentGallery" component={ComponentGallery} />


      <Stack.Screen name="Tabs" component={TabNavigator} />

      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="PasswordSetting" component={PasswordSetting} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="PurchaseHistory" component={PurchaseHistory} />
      <Stack.Screen name="AstrologyResults" component={AstrologyResults} />
      <Stack.Screen name="BaziResults" component={BaziResults} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
