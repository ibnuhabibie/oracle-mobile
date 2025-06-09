import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import ScreenContainer from '../../components/layouts/ScreenContainer';

import { MainNavigatorParamList } from '../../navigators/types';
import SignInForm from '../../features/auth/signin-form';
import { AppText } from '../../components/ui/app-text';
import { COLORS } from '../../constants/colors';

type SignInnProps = NativeStackScreenProps<MainNavigatorParamList, 'SignIn'>;

const SignIn: FC<SignInnProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const onSuccess = (email: string) => {
    navigation.navigate('OtpVerification', { email });
  };

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <AppText variant='subtitle2' color='primary' style={styles.intro}>{t('DEAR SEAKERS')}</AppText>
      <AppText variant='largeTitle2' style={styles.title}>Sign In</AppText>
      <AppText variant='caption1' style={styles.subtitle}>
        The cosmos whispers.{'\n'}Discover what’s meant for you.
      </AppText>

      <SignInForm onSuccess={onSuccess} />

      <AppText variant='body1' style={styles.footer}>
        Don’t have an account?{' '}
        <AppText
          color='primary'
          onPress={() => navigation.navigate('SignUp')}>
          Sign Up
        </AppText>
      </AppText>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  intro: {
    letterSpacing: 7,
    marginTop: 26,
    textAlign: 'center'
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: COLORS['dark-gray']
  },
  footer: {
    textAlign: 'center',
    marginTop: 16,
  },
});

export default SignIn;
