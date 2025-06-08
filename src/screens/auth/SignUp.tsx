import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { t } from 'i18next';

import ScreenContainer from '../../components/layouts/ScreenContainer';
import SignUpForm from '../../features/auth/signup-form';
import { MainNavigatorParamList } from '../../navigators/types';
import { COLORS } from '../../constants/colors';
import { AppText } from '../../components/ui/app-text';

type SignUpProps = NativeStackScreenProps<MainNavigatorParamList, 'SignUp'>;

const SignUp: FC<SignUpProps> = ({ navigation }) => {

  const onSuccess = (email: string) => {
    navigation.navigate('Otp', { email });
  };

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <AppText variant='subtitle2' color='primary' style={styles.intro}>{t('DEAR SEAKERS')}</AppText>
      <AppText variant='largeTitle2' style={styles.title}>Sign Up</AppText>
      <AppText variant='caption1' style={styles.subtitle}>
        The cosmos whispers.{'\n'}Join & uncover your destiny.
      </AppText>

      <SignUpForm onSuccess={onSuccess} />

      <AppText variant='body1' style={styles.footer}>
        Already have an account?{' '}
        <AppText
          color='primary'
          onPress={() => navigation.navigate('SignIn')}>
          Sign In
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

export default SignUp;
