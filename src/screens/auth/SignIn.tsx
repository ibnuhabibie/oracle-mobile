import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { scaleFont, scaleSize } from '../../utils/scale';
import { useTranslation } from 'react-i18next';

import ScreenContainer from '../../components/layouts/screen-container';

import { MainNavigatorParamList } from '../../navigators/types';
import SignInForm from '../../features/auth/signin-form';
import { AppText } from '../../components/ui/app-text';

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
      navigation.navigate('OtpVerification', { email: user.email });
    } else if (!isProfileCompleted(user)) {
      navigation.navigate('Onboarding');
    } else if (!user.mbti_profile) {
      navigation.navigate('MbtiQuiz');
    } else {
      navigation.navigate('Tabs');
    }
  };

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <AppText variant='subtitle2' color='primary' style={styles.intro}>{t('DEAR SEEKERS')}</AppText>
      <AppText variant='largeTitle2' style={styles.title} color='neutral'>{t('SIGN IN')}</AppText>
      <AppText variant='caption1' style={styles.subtitle} color='neutral'>
        {t('THE COSMOS WHISPERS')}
      </AppText>

      <SignInForm onSuccess={onSuccess} />

      <AppText variant='body1' style={styles.footer} color='neutral'>
        {t('DONT HAVE AN ACCOUNT')}{' '}
        <AppText
          color='primary'
          onPress={() => navigation.navigate('SignUp')}>
          {t('SIGN UP')}
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
