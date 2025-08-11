import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

import ScreenContainer from '../../components/layouts/screen-container';
import { AppButton } from '../../components/ui/app-button';
import { AppText } from '../../components/ui/app-text';
import { MainNavigatorParamList } from '../../navigators/types';
import WelcomeIllustration from '../../assets/images/welcome-illustration';

type WelcomeProps = NativeStackScreenProps<MainNavigatorParamList, 'Welcome'>;

const Welcome: React.FC<WelcomeProps> = ({ navigation }) => {
  const { t } = useTranslation();

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
    <ScreenContainer>
      <View style={styles.container}>
        <AppText variant='subtitle2' color='primary' style={styles.subtitle}>{t('WELCOME TO')}</AppText>
        <AppText style={styles.title}>AFFINITY</AppText>
        <WelcomeIllustration />
        <View style={styles.buttonContainer}>
          <AppButton
            title={t('GET STARTED')}
            variant='primary'
            onPress={handleClick}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
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
  }
});

export default Welcome;
