import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {enableScreens} from 'react-native-screens';
import {AuthProvider} from './src/context/AuthContext';
import RootNavigator from './src/navigators/RootNavigator';

enableScreens(false);

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
