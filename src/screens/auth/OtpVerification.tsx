import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import SMSIcon from '../../components/icons/SMS';
import ScreenContainer from '../../components/layouts/ScreenContainer';
import { AppButton } from '../../components/ui/app-button';
import { AppText } from '../../components/ui/app-text';
import ShinyContainer from '../../components/widgets/ShinyContainer';
import { COLORS } from '../../constants/colors';
import { MainNavigatorParamList } from '../../navigators/types';


type OtpVerificationProps = NativeStackScreenProps<MainNavigatorParamList, 'Otp'>;

const OtpVerification: FC<OtpVerificationProps> = ({ navigation }) => {
  const OTP_LENGTH = 5;

  const route = useRoute();
  const { email } = route.params;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    inputsRef.current[0].current?.focus();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text !== '' && index < OTP_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const resendCode = () => {
    if (timer === 0) {
      setTimer(60);
      // Trigger resend API call here
    }
  };

  const handleSubmit = () => {
    const finalOtp = otp.join('');
    if (finalOtp.length === OTP_LENGTH) {
      setErrorMessage(null);
    } else {
      setErrorMessage('Please fill all OTP fields.');
      return;
    }
    console.log('Entered OTP:', finalOtp);
    // Validate or submit OTP
    Keyboard.dismiss();
    navigation.push('OtpSuccess');
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

        <View style={styles.otpContainer}>
          {
            otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => {
                  inputsRef.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  errorMessage && styles.inputError, // Apply error border
                ]}
                value={digit}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={text => handleChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                returnKeyType="done"
              />
            ))
          }
        </View>
        {
          errorMessage && <AppText style={styles.errorText}>{errorMessage}</AppText>
        }
        <AppButton title="Confirm" onPress={handleSubmit} style={styles.button} />

        <AppText style={styles.resendText}>
          Didn’t receive the code?{' '}
          <AppText
            color='primary'
            onPress={resendCode}
            disabled={timer > 0}>
            Resend {timer > 0 ? `00:${timer.toString().padStart(2, '0')}` : ''}
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 12,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS['light-gray'],
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.black,
  },
  button: {
    marginTop: 148,
  },
  resendText: {
    color: '#555',
    marginTop: 15,
  },
  inputError: {
    borderColor: COLORS.red,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default OtpVerification;
