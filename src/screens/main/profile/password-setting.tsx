import React, { FC, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { scaleSize } from '../../../utils/scale';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Header from '../../../components/ui/header';
import PasswordToggle from '../../../components/ui/password-toggle';
import AppInput from '../../../components/ui/app-input';
import { AppText } from '../../../components/ui/app-text';
import { AppButton } from '../../../components/ui/app-button';
import ScreenContainer from '../../../components/layouts/screen-container';

import api from '../../../utils/http';
import type { MainNavigatorParamList } from '../../../navigators/types';

type PasswordSettingProps = NativeStackScreenProps<MainNavigatorParamList, 'PasswordSetting'>;

interface PasswordSettingDTO {
  current_password: string
  new_password: string
  confirm_password: string
}


const PasswordSetting: FC<PasswordSettingProps> = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: ''
    },
  });

  const formRules = {
    current_password: {
      required: t('passwordSettingForm.passwordRequired'),
      minLength: {
        value: 6,
        message: t('passwordSettingForm.passwordMinLength')
      }
    },
    new_password: {
      required: t('passwordSettingForm.passwordRequired'),
      minLength: {
        value: 6,
        message: t('passwordSettingForm.passwordMinLength')
      }
    },
    confirm_password: {
      required: t('passwordSettingForm.passwordRequired'),
      minLength: {
        value: 6,
        message: t('passwordSettingForm.passwordMinLength')
      },
      validate: (value: string) =>
        value === getValues('new_password') || t('passwordSettingForm.passwordsDoNotMatch')
    }
  }

  const handleChangePassword = async (data: PasswordSettingDTO) => {
    setLoading(true);
    setApiError(null);
    try {
      await api.put('/v1/users/change-password', {
        current_password: data.current_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password
      });
      setLoading(false);
      // Show success message and/or navigate back
      Alert.alert(t('passwordSettingForm.passwordChangedSuccessfully'));
      await api.post(`/v1/users/auth/logout`);
      await AsyncStorage.removeItem('user_profile');
      await AsyncStorage.removeItem('auth_token');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error: any) {
      console.log(error)
      setLoading(false);
      setApiError(error?.message || t('passwordSettingForm.failedToChangePassword'));
      Alert.alert(apiError || t('passwordSettingForm.failedToChangePassword'));
    }
  };

  return (
    <ScreenContainer
      header={
        <Header
          title={t('passwordSettingForm.title')}
          onBack={() => navigation.goBack()}
        />
      }
    >
      <View style={styles.formContainer}>
        <AppText color='neutral'>{t('passwordSettingForm.currentPassword')}</AppText>
        <AppInput<PasswordSettingDTO>
          control={control}
          name="current_password"
          rules={formRules.current_password}
          placeholder={t('passwordSettingForm.password')}
          secureTextEntry={!showCurrentPassword}
          errors={errors}
          rightIcon={
            <PasswordToggle
              onToggle={() => setShowCurrentPassword(prev => !prev)}
              showPassword={showCurrentPassword} />
          }
        />
        <AppText color='neutral'>{t('passwordSettingForm.newPassword')}</AppText>
        <AppInput<PasswordSettingDTO>
          control={control}
          name="new_password"
          rules={formRules.new_password}
          placeholder={t('passwordSettingForm.password')}
          secureTextEntry={!showNewPassword}
          errors={errors}
          rightIcon={
            <PasswordToggle
              onToggle={() => setShowNewPassword(prev => !prev)}
              showPassword={showNewPassword} />
          }
        />
        <AppText color='neutral'>{t('passwordSettingForm.confirmPassword')}</AppText>
        <AppInput<PasswordSettingDTO>
          control={control}
          name="confirm_password"
          rules={formRules.confirm_password}
          placeholder={t('passwordSettingForm.password')}
          secureTextEntry={!showConfirmPassword}
          errors={errors}
          rightIcon={
            <PasswordToggle
              onToggle={() => setShowConfirmPassword(prev => !prev)}
              showPassword={showConfirmPassword} />
          }
        />
        <AppButton title={loading ? t('passwordSettingForm.loading') : t('passwordSettingForm.changePassword')} onPress={handleSubmit(handleChangePassword)} disabled={loading} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flexDirection: 'column',
    gap: scaleSize(8, 8, 12),
    paddingTop: scaleSize(8, 8, 12)
  },
});

export default PasswordSetting;
