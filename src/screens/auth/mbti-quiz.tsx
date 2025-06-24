import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { APP_URL } from '@env';

import ScreenContainer from '../../components/layouts/screen-container';
import { MainNavigatorParamList } from '../../navigators/types';
import { Text } from 'react-native-svg';

const MbtiQuiz: FC<{
  navigation: NativeStackNavigationProp<MainNavigatorParamList, 'MbtiQuiz'>;
}> = ({ navigation }) => {

  const onMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log('Message from webview:', data);

    if (data == 'CLOSE_PAGE') {
      navigation.replace('Tabs');
    }
  };

  const injectedJavaScript = `
    console.log = function(message) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    };
  `;

  const [uri, setUri] = useState<string>('');

  useEffect(() => {
    const getUri = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      const version = Date.now(); // Add timestamp to disable cache
      console.log(`${APP_URL}/quiz/mbti?token=${token}&version=${version}`)
      setUri(`${APP_URL}/quiz/mbti?token=${token}&version=${version}`);
    };
    getUri();

    console.log(APP_URL)
  }, []);

  return (
    <ScreenContainer style={styles.container}>
      <Text>{uri} asdasd</Text>
      <WebView
        source={{ uri }}
        style={styles.webview}
        onMessage={onMessage}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            color="#000000"
            size="large"
            style={StyleSheet.absoluteFill}
          />
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  webview: {
    flex: 1
  }
});

export default MbtiQuiz;
