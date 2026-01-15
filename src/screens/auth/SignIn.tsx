import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { StyleSheet, Linking } from 'react-native';
import { scaleFont, scaleSize } from '../../utils/scale';
import { useTranslation } from 'react-i18next';

import { ID_URL } from '@env';


import ScreenContainer from '../../components/layouts/screen-container';

import { MainNavigatorParamList } from '../../navigators/types';
import SignInForm from '../../features/auth/signin-form';
import { AppText } from '../../components/ui/app-text';
import { getLocale } from '../../hooks/use-storage';

type SignInProps = NativeStackScreenProps<MainNavigatorParamList, 'SignIn'>;

const SignIn: FC<SignInProps> = ({ navigation }) => {
  const { t } = useTranslation();

  // TODO: merge the logics
  const isProfileCompleted = (user: any) => {
    return (
      user.birth_date &&
      user.birth_time &&
      user.birth_city &&
      user.birth_country
    );
  };

  const onSuccess = (user: any) => {
    if (!user.is_email_verified) {
      navigation.replace('OtpVerification', { email: user.email });
    } else if (!isProfileCompleted(user)) {
      navigation.replace('Onboarding');
    } else if (!user.mbti_profile) {
      navigation.replace('MbtiQuiz');
    } else {
      navigation.replace('Tabs');
    }
  };

  const handleForgotPassword = async () => {
    const locale = await getLocale();
    const url = `${ID_URL}?locale=${locale}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn("Can't open this URL:", url);
    }
  }

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <AppText variant='subtitle2' color='primary' style={styles.intro}>{t('login.intro')}</AppText>
      <AppText variant='largeTitle2' style={styles.title} color='neutral'>{t('login.title')}</AppText>
      <AppText variant='caption1' style={styles.subtitle} color='neutral'>
        {t('login.subtitle')}
      </AppText>

      <SignInForm onSuccess={onSuccess} />

      <AppText variant='body1' style={styles.footer} color='neutral'>
        {t('login.footer')}{' '}
        <AppText
          color='primary'
          onPress={() => navigation.navigate('SignUp')}>
          {t('login.signupButtonText')}
        </AppText>
      </AppText>
      <AppText variant='body1' style={styles.footer} color='neutral' onPress={handleForgotPassword}>
        {t('login.forgotPassword')}
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
    lineHeight: scaleSize(22),
    fontSize: scaleFont(12), // assuming caption1 is around 12
  },
  footer: {
    textAlign: 'center',
    marginTop: scaleSize(16),
    fontSize: scaleFont(14), // assuming body1 is around 14
  },
});

export default SignIn;
