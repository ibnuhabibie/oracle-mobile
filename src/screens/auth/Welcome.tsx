import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

import ScreenContainer from '../../components/layouts/ScreenContainer';
import { AppButton } from '../../components/ui/app-button';
import { AppText } from '../../components/ui/app-text';
import { MainNavigatorParamList } from '../../navigators/types';

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
        <Image
          source={require('../../assets/images/onboarding/onboarding.png')}
          style={{ width: 431, height: 577 }}
        />
        <AppText variant='subtitle2' color='primary' style={styles.subtitle}>{t('WELCOME TO')}</AppText>
        <AppText style={styles.title}>AFFINITY</AppText>
        <AppButton
          title={t('GET STARTED')}
          variant='primary'
          onPress={handleClick}
          style={{ marginTop: 24 }}
        />
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
    fontSize: 40,
  },
  subtitle: {
    letterSpacing: 7,
    marginTop: 26,
  },
});

export default Welcome;
