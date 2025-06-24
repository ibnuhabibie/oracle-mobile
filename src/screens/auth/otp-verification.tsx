import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import SMSIcon from '../../components/icons/SMS';
import ScreenContainer from '../../components/layouts/screen-container';
import { AppButton } from '../../components/ui/app-button';
import { AppText } from '../../components/ui/app-text';
import ShinyContainer from '../../components/widgets/ShinyContainer';
import { MainNavigatorParamList } from '../../navigators/types';
import api from '../../utils/http';
import { useOtpTimer } from '../../hooks/use-otp-timer';
import { OtpInput } from '../../features/auth/otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OtpVerificationProps = NativeStackScreenProps<MainNavigatorParamList, 'OtpVerification'>;

const OtpVerification: FC<OtpVerificationProps> = ({ navigation }) => {
  const route = useRoute();
  const { email, shouldResendOtp } = route.params as {
    email: string;
    shouldResendOtp?: boolean;
  };

  const { formatted, start, timeLeft } = useOtpTimer(5);
  const otpInputRef = useRef();

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
      await api.post('/v1/users/resend-otp', { email });
      otpInputRef.current?.reset();

      const storedProfile = await AsyncStorage.getItem('user_profile');
      const profile = JSON.parse(storedProfile);
      profile.is_email_verified = true;
      await AsyncStorage.setItem('user_profile', JSON.stringify(profile));

    } catch (error) {
      Alert.alert('Error', error?.meta?.message || 'Something went wrong');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!otp) {
        setErrorMessage('Please fill all OTP fields.');
        return;
      }

      setErrorMessage(null);
      Keyboard.dismiss();

      await api.post('/v1/users/verify-email', { email, otp });
      navigation.replace('OtpSuccess');
    } catch (error) {
      setErrorMessage(error?.meta?.message || 'Something went wrong');
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ShinyContainer>
          <SMSIcon />
        </ShinyContainer>
        <AppText variant='subtitle1' color='primary' style={styles.title}>OTP VERIFICATION</AppText>
        <AppText variant='caption1' style={styles.subtitle}>
          We have sent an OTP verification code via Email to{'\n'}
          {email}. Please enter the code.
        </AppText>

        <OtpInput
          onChangeOtp={(otp) => setOtp(otp)}
          error={errorMessage}
          ref={otpInputRef} />
        <AppButton title="Continue" onPress={handleSubmit} style={styles.button} />

        <AppText style={styles.resendText}>
          Didn’t receive the code?{' '}
          <AppText
            color='primary'
            onPress={resendOtp}
            disabled={timeLeft > 0}>
            Resend {formatted}
          </AppText>
        </AppText>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    alignItems: 'center',
  },
  title: {
    marginBottom: 10,
    marginTop: 24,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    marginTop: 148,
  },
  resendText: {
    marginTop: 15,
  },
});

export default OtpVerification;
