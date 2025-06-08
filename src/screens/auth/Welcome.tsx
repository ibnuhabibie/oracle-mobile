import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ScreenContainer from '../../components/layouts/ScreenContainer';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';
import { COLORS } from '../../constants/colors';
import { MainNavigatorParamList } from '../../navigators/types';

type Props = {
  navigation: NativeStackNavigationProp<MainNavigatorParamList, 'Welcome'>;
};

class Welcome extends Component<Props> {
  handleClick = async () => {
    try {
      const language = await AsyncStorage.getItem('language');
      if (language) {
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
          <Text style={styles.subtitle}>WELCOME TO</Text>
          <Text style={styles.title}>AFFINITY</Text>
          <Button
            title="Get Started"
            onPress={this.handleClick}
            style={{ width: '100%', marginTop: 24 }}
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
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 18,
    letterSpacing: 7,
    marginTop: 26,
    color: COLORS.primary,
  },
});

export default Welcome;