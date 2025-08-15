import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import Video from 'react-native-video';

import ScreenContainer from '../../components/layouts/screen-container';
import { AppButton } from '../../components/ui/app-button';
import { AppText } from '../../components/ui/app-text';
import { MainNavigatorParamList } from '../../navigators/types';
import WelcomeIllustration from '../../assets/images/welcome-illustration';

type WelcomeProps = NativeStackScreenProps<MainNavigatorParamList, 'Welcome'>;

const Welcome: React.FC<WelcomeProps> = ({ navigation }) => {
  const [opacity] = useState(new Animated.Value(0));

  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150, // quick fade to avoid visible controls
      useNativeDriver: true,
    }).start();
  };
  const handleClick = async () => {
    try {
      const language = await AsyncStorage.getItem('language');
      console.log(language, 'language');

      if (!language) {
        navigation.navigate('SignIn');
      } else {
        navigation.navigate('LanguageSelection');
      }
    } catch (error) {
      console.log(error);
      navigation.navigate('LanguageSelection');
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
          pointerEvents="none"
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          onLoad={fadeIn} // only fade in after video is loaded
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
  },
  title: {
    fontSize: 43,
    color: '#D5D5D5',
    letterSpacing: 9
  },
  subtitle: {
    letterSpacing: 7,
    marginTop: 26,
  },
  buttonContainer: {
    width: '80%',
    marginTop: 32,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    zIndex: 100,
  },
});

export default Welcome;
