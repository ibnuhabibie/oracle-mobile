import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Purchases from 'react-native-purchases';

import ScreenContainer from '../../../components/layouts/screen-container';
import SignUpForm from './signup-form';
import { AppText } from '../../../components/ui/app-text';

import { scaleFont, scaleSize } from '../../../utils/scale';
import { MainNavigatorParamList } from '../../../navigators/types';

type SignUpProps = NativeStackScreenProps<MainNavigatorParamList, 'SignUp'>;

const SignUp: FC<SignUpProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const onSuccess = async (data: any) => {
    await Purchases.logIn(data.rc_customer_id);
    navigation.navigate('OtpVerification', { email: data.email });
  };

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <AppText variant='subtitle2' color='primary' style={styles.intro}>{t('register.intro')}</AppText>
      <AppText variant='largeTitle2' style={styles.title} color='neutral'>{t('register.title')}</AppText>
      <AppText variant='caption1' style={styles.subtitle} color='neutral'>
        {t('register.subtitle')}
      </AppText>

      <SignUpForm onSuccess={onSuccess} />

      <AppText variant='body1' style={styles.footer} color='neutral'>
        {t('register.footer')}{' '}
        <AppText
          color='primary'
          onPress={() => navigation.navigate('SignIn')}>
          {t('register.signinButtonText')}
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
    fontSize: scaleFont(16),
  },
  title: {
    textAlign: 'center',
    marginBottom: scaleSize(6),
    fontSize: scaleFont(28),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: scaleSize(24),
    fontSize: scaleFont(12),
  },
  footer: {
    textAlign: 'center',
    marginTop: scaleSize(16),
    fontSize: scaleFont(14),
  },
});

export default SignUp;
