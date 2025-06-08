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
    const fullCode = otp.join('');
    console.log('Entered OTP:', fullCode);
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
        <AppText style={styles.title}>OTP VERIFICATION</AppText>
        <AppText style={styles.subtitle}>
          We have sent an OTP verification code via Email to{'\n'}
          {email}. Please enter the code.
        </AppText>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => {
                inputsRef.current[index] = ref;
              }}
              style={styles.otpInput}
              value={digit}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              returnKeyType="done"
            />
          ))}
        </View>

        <AppButton title="Confirm" onPress={handleSubmit} style={styles.button} />

        <AppText style={styles.resendText}>
          Didn’t receive the code?{' '}
          <AppText
            onPress={resendCode}
            style={[styles.resendLink, timer > 0 && { color: '#C0A589' }]}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  title: {
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: 10,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 14,
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
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
  },
  button: {
    marginTop: 148,
  },
  resendText: {
    fontSize: 13,
    color: '#555',
    marginTop: 15,
  },
  resendLink: {
    color: '#C0A589',
    fontWeight: '600',
  },
});

export default OtpVerification;
