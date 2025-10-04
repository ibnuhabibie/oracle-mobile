import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, StyleSheet, View } from 'react-native';
import { scaleFont, scaleSize } from '../../utils/scale';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import SMSIcon from '../../components/icons/auth/sms-icon';
import ScreenContainer from '../../components/layouts/screen-container';
import { AppButton } from '../../components/ui/app-button';
import { AppText } from '../../components/ui/app-text';
import ShinyContainer from '../../components/widgets/shiny-container';
import { MainNavigatorParamList } from '../../navigators/types';
import api from '../../utils/http';
import { useOtpTimer } from '../../hooks/use-otp-timer';
import { OtpInput } from '../../features/auth/otp-input';
import type { OtpInputRef } from '../../features/auth/otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getErrorMessage } from '../../utils/error';

type OtpVerificationProps = NativeStackScreenProps<MainNavigatorParamList, 'OtpVerification'>;

const OtpVerification: FC<OtpVerificationProps> = ({ navigation }) => {
  const route = useRoute();
  const { email, shouldResendOtp } = route.params as {
    email: string;
    shouldResendOtp?: boolean;
  };

  const { t } = useTranslation();
  const { formatted, start, timeLeft } = useOtpTimer(180);
  const otpInputRef = useRef<OtpInputRef>(null);

  const [otp, setOtp] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (shouldResendOtp) {
      resendOtp();
    }
  }, [shouldResendOtp]);

  useEffect(() => {
    start()
  }, []);

  const resendOtp = async () => {
    try {
      start()
      const res = await api.post('/v1/users/resend-otp', { email });
      otpInputRef.current?.reset();

      const storedProfile = await AsyncStorage.getItem('user_profile');
      const profile = JSON.parse(storedProfile);
      console.log(profile, res)

      profile.is_email_verified = true;
      await AsyncStorage.setItem('user_profile', JSON.stringify(profile));

      Toast.show({
        type: 'success',
        text1: t('otpVerification.success'),
        text2: t('otpVerification.resentSuccessfully'),
      });

    } catch (error) {
      console.log(error)
      const message = getErrorMessage(error, t('otpVerification.genericError'));
      Alert.alert(t('otpVerification.error'), String(message));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!otp) {
        setErrorMessage(t('otpVerification.fillAllFields'));
        return;
      }

      setErrorMessage(null);
      Keyboard.dismiss();

      await api.post('/v1/users/verify-email', { email, otp: otp as string });
      navigation.replace('OtpSuccess');
    } catch (error) {
      const message = getErrorMessage(error, t('otpVerification.genericError'));
      setErrorMessage(String(message));
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ShinyContainer>
          <SMSIcon />
        </ShinyContainer>
        <AppText variant='subtitle1' color='primary' style={styles.title}>{t('otpVerification.title')}</AppText>
        <AppText variant='caption1' style={styles.subtitle} color='white'>
          {t('otpVerification.sentMessage', { email })}
        </AppText>

        <OtpInput
          onChangeOtp={(otp) => setOtp(otp)}
          error={errorMessage ?? undefined}
        />
        <AppButton title={t('otpVerification.continue')} onPress={handleSubmit} style={styles.button} />

        <AppText style={styles.resendText} color='white'>
          {t('otpVerification.didntReceiveCode')}{' '}
          <AppText
            color='primary'
            onPress={resendOtp}
            disabled={timeLeft > 0}>
            {t('otpVerification.resend')}{timeLeft > 0 ? ` ${formatted}` : ''}
          </AppText>
        </AppText>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: scaleSize(32),
    alignItems: 'center',
  },
  title: {
    marginBottom: scaleSize(10),
    marginTop: scaleSize(24),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: scaleSize(30),
    lineHeight: scaleSize(20),
    fontSize: scaleFont(12), // assuming caption1
  },
  button: {
    marginTop: scaleSize(148),
  },
  resendText: {
    marginTop: scaleSize(15),
    fontSize: scaleFont(14), // assuming body1
  },
});

export default OtpVerification;
