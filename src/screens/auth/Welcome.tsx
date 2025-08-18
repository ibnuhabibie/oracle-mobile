import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MainNavigatorParamList } from '../../navigators/types';
import { COLORS } from '../../constants/colors';

type WelcomeProps = NativeStackScreenProps<MainNavigatorParamList, 'Welcome'>;

const Welcome: React.FC<WelcomeProps> = ({ navigation }) => {
  const [opacity] = useState(new Animated.Value(0));

  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
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
          onLoad={fadeIn}
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
