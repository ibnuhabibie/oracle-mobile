import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import { enableScreens } from 'react-native-screens';

import { AuthProvider } from './src/context/auth-context';
import MainNavigator from './src/navigators/main-navigator';
import { FloatingPreviewButton } from './src/features/component-preview/floating-preview-button';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

enableScreens(false);

class App extends Component {
  render() {
    return (
      <GestureHandlerRootView>
        <AuthProvider>
          <NavigationContainer>
            <MainNavigator />
            <FloatingPreviewButton />
          </NavigationContainer>
        </AuthProvider>
      </GestureHandlerRootView>
    );
  }
}

export default App;
