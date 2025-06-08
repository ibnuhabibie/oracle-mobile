import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ScreenContainer from '../../components/layouts/ScreenContainer';
import { Button } from '../../components/ui/button';
import { AppText } from '../../components/ui/app-text';
import { MainNavigatorParamList } from '../../navigators/types';

type WelcomeProps = NativeStackScreenProps<MainNavigatorParamList, 'Welcome'>;

class Welcome extends Component<WelcomeProps> {
  handleClick = async () => {
    try {
      const language = await AsyncStorage.getItem('language');
      console.log(language, 'language');

      if (!language) {
        this.props.navigation.navigate('SignIn');
      } else {
        this.props.navigation.navigate('LanguageSelection');
      }
    } catch (error) {
      console.log(error);
      this.props.navigation.navigate('LanguageSelection');
    }
  };

  render() {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <Image
            source={require('../../assets/images/onboarding/onboarding.png')}
            style={{ width: 431, height: 577 }}
          />
          <AppText variant='subtitle2' color='primary' style={styles.subtitle}>WELCOME TO</AppText>
          <AppText style={styles.title}>AFFINITY</AppText>
          <Button
            title="Get Started"
            variant='primary'
            onPress={this.handleClick}
            style={{ marginTop: 24 }}
          />
        </View>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
  },
  subtitle: {
    letterSpacing: 7,
    marginTop: 26,
  },
});

export default Welcome;