import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import ScreenContainer from '../../components/layouts/screen-container';
import SignUpForm from '../../features/auth/signup-form';
import { MainNavigatorParamList } from '../../navigators/types';
import { COLORS } from '../../constants/colors';
import { AppText } from '../../components/ui/app-text';

type SignUpProps = NativeStackScreenProps<MainNavigatorParamList, 'SignUp'>;

const SignUp: FC<SignUpProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const onSuccess = (email: string) => {
    navigation.navigate('Otp', { email });
  };

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <AppText variant='subtitle2' color='primary' style={styles.intro}>{t('DEAR SEAKERS')}</AppText>
      <AppText variant='largeTitle2' style={styles.title}>{t('SIGN UP')}</AppText>
      <AppText variant='caption1' style={styles.subtitle}>
        {t('SIGN UP SUBTITLE').replace('{\\n}', '\n')}
      </AppText>

      <SignUpForm onSuccess={onSuccess} />

      <AppText variant='body1' style={styles.footer}>
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
