import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, StyleSheet, View, Platform } from 'react-native';
import { scaleSize } from '../../../utils/scale';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import Purchases from 'react-native-purchases';

import api from '../../../utils/http';
import { AppButton } from '../../../components/ui/app-button';
import AppInput from '../../../components/ui/app-input';
import PasswordToggle from '../../../components/ui/password-toggle';
import { useAsyncStorage } from '../../../hooks/use-storage';
import { COLORS } from '../../../constants/colors';
import { LoginDTO, AuthFormProps } from './types';

const SignInForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { setAuthToken, sync } = useAsyncStorage();

  const formRules = {
    email: {
      required: t('loginForm.emailRequired'),
      pattern: {
        value: /^\S+@\S+$/i,
        message: t('loginForm.invalidEmailFormat'),
      },
    },
    password: {
      required: t('loginForm.passwordRequired'),
      minLength: {
        value: 6,
        message: t('loginForm.passwordMinLength'),
      },
    },
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTO>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginDTO) => {
    setLoading(true);
    try {
      const locale = (await AsyncStorage.getItem('language')) || 'en';
      console.log(locale);

      // Gather device info
      const deviceBrand = DeviceInfo.getBrand();
      const deviceModel = DeviceInfo.getModel();
      const systemVersion = DeviceInfo.getSystemVersion();
      const uniqueId = DeviceInfo.getUniqueId();
      const appVersion = DeviceInfo.getVersion();

      // Get FCM token
      let fcmToken = '';
      try {
        await messaging().registerDeviceForRemoteMessages();
        fcmToken = await messaging().getToken();
        console.log(fcmToken, 'fcmToken');
      } catch (e) {
        console.log('Failed to get FCM token:', e);
      }

      const res = await api.post('/v1/users/auth/login', {
        ...data,
        locale,
        fcm_token: fcmToken,
        additional_info: {
          os: Platform.OS,
          brand: deviceBrand,
          model: deviceModel,
          system_version: systemVersion,
          unique_id: uniqueId,
          app_version: appVersion,
        },
      });

      console.log('onSuccess calling');

      await setAuthToken(res.data.token);
      await sync();

      // Encrypt user_id before logging in to RevenueCat
      const { customerInfo } = await Purchases.logIn(res.data.rc_customer_id);
      console.log(customerInfo.originalAppUserId, customerInfo, 'rc_customer_id', res.data.rc_customer_id);

      onSuccess(res.data);
    } catch (error) {
      let message = '';
      if (
        typeof error === 'object' &&
        error &&
        'meta' in error &&
        typeof (error as any).meta?.message === 'string'
      ) {
        message = (error as any).meta.message;
      } else {
        message = t('loginForm.loginFailed');
      }
      Alert.alert(t('loginForm.loginFailed'), message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={{ flexDirection: 'column', gap: 12 }}>
        <AppInput<LoginDTO>
          control={control}
          name="email"
          rules={formRules.email}
          placeholder={t('loginForm.email')}
          keyboardType="email-address"
          errors={errors}
          inputStyle={styles.appInput}
        />
        <AppInput<LoginDTO>
          control={control}
          name="password"
          rules={formRules.password}
          placeholder={t('loginForm.password')}
          secureTextEntry={!showPassword}
          errors={errors}
          rightIcon={
            <PasswordToggle
              onToggle={() => setShowPassword(prev => !prev)}
              showPassword={showPassword}
            />
          }
          inputStyle={styles.appInput}
        />
      </View>

      <AppButton
        title={t('loginForm.signIn')}
        onPress={handleSubmit(onSubmit)}
        style={styles.signInButton}
        loading={loading}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  signInButton: {
    marginTop: scaleSize(12),
    width: '100%',
  },
  appInput: {
    borderColor: COLORS['light-gray'],
    color: COLORS.red,
    // If you add fontSize, padding, margin here, use scaleFont/scaleSize
  },
});

export default SignInForm;