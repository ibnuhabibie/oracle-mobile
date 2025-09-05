import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { scaleFont, scaleSize } from '../../utils/scale';
import { useTranslation } from 'react-i18next';

import ScreenContainer from '../../components/layouts/screen-container';
import SignUpForm from '../../features/auth/signup-form';
import { MainNavigatorParamList } from '../../navigators/types';
import { AppText } from '../../components/ui/app-text';

type SignUpProps = NativeStackScreenProps<MainNavigatorParamList, 'SignUp'>;

const SignUp: FC<SignUpProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const onSuccess = (email: string) => {
    navigation.navigate('OtpVerification', { email });
  };

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <AppText variant='subtitle2' color='primary' style={styles.intro}>{t('DEAR SEEKERS')}</AppText>
      <AppText variant='largeTitle2' style={styles.title} color='neutral'>{t('SIGN UP')}</AppText>
      <AppText variant='caption1' style={styles.subtitle} color='neutral'>
        {t('SIGN UP SUBTITLE')}
      </AppText>

      <SignUpForm onSuccess={onSuccess} />

      <AppText variant='body1' style={styles.footer} color='neutral'>
        {t('ALREADY HAVE AN ACCOUNT')}{' '}
        <AppText
          color='primary'
          onPress={() => navigation.navigate('SignIn')}>
          {t('SIGN IN')}
        </AppText>
      </AppText>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  intro: {
    letterSpacing: scaleSize(7),
    marginTop: scaleSize(26),
    textAlign: 'center',
    fontSize: scaleFont(16), // assuming subtitle2 is around 16
  },
  title: {
    textAlign: 'center',
    marginBottom: scaleSize(6),
    fontSize: scaleFont(28), // assuming largeTitle2 is around 28
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: scaleSize(24),
    fontSize: scaleFont(12), // assuming caption1 is around 12
  },
  footer: {
    textAlign: 'center',
    marginTop: scaleSize(16),
    fontSize: scaleFont(14), // assuming body1 is around 14
  },
});

export default SignUp;
