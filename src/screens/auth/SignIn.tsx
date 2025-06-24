import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import ScreenContainer from '../../components/layouts/screen-container';

import { MainNavigatorParamList } from '../../navigators/types';
import SignInForm from '../../features/auth/signin-form';
import { AppText } from '../../components/ui/app-text';
import { COLORS } from '../../constants/colors';

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
      <AppText variant='subtitle2' color='primary' style={styles.intro}>{t('DEAR SEAKERS')}</AppText>
      <AppText variant='largeTitle2' style={styles.title}>{t('SIGN IN')}</AppText>
      <AppText variant='caption1' style={styles.subtitle}>
        {t('THE COSMOS WHISPERS').replace('{\\n}', '\n')}
      </AppText>

      <SignInForm onSuccess={onSuccess} />

      <AppText variant='body1' style={styles.footer}>
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
