import React, { FC, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../../../navigators/types';
import ArrowIcon from '../../../components/icons/Arrow';
import ScreenContainer from '../../../components/layouts/screen-container';
import Header from '../../../components/ui/header';
import PasswordToggle from '../../../components/ui/password-toggle';
import AppInput from '../../../components/ui/app-input';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AppText } from '../../../components/ui/app-text';
import api from '../../../utils/http';
import { AppButton } from '../../../components/ui/app-button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fontFamilies } from '../../../constants/fonts';
import { COLORS } from '../../../constants/colors';

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
      current_password: 'password123',
      new_password: '',
      confirm_password: ''
    },
  });

  const formRules = {
    current_password: {
      required: t('PASSWORD IS REQUIRED'),
      minLength: {
        value: 6,
        message: t('PASSWORD MIN LENGTH')
      }
    },
    new_password: {
      required: t('PASSWORD IS REQUIRED'),
      minLength: {
        value: 6,
        message: t('PASSWORD MIN LENGTH')
      }
    },
    confirm_password: {
      required: t('PASSWORD IS REQUIRED'),
      minLength: {
        value: 6,
        message: t('PASSWORD MIN LENGTH')
      },
      validate: (value: string) =>
        value === getValues('new_password') || t('PASSWORDS DO NOT MATCH')
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
      Alert.alert(t('PASSWORD CHANGED SUCCESSFULLY'));
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
      setApiError(error?.message || t('FAILED TO CHANGE PASSWORD'));
      Alert.alert(apiError || t('FAILED TO CHANGE PASSWORD'));
    }
  };

  return (
    <ScreenContainer
      header={
        <Header
          title="Password Settings"
          onBack={() => navigation.goBack()}
        />
      }
    >
      <View style={styles.formContainer}>
        <AppText>Current Password</AppText>
        <AppInput<PasswordSettingDTO>
          control={control}
          name="current_password"
          rules={formRules.current_password}
          placeholder={t('PASSWORD')}
          secureTextEntry={!showCurrentPassword}
          errors={errors}
          rightIcon={
            <PasswordToggle
              onToggle={() => setShowCurrentPassword(prev => !prev)}
              showPassword={showCurrentPassword} />
          }
        />
        <AppText>New Password</AppText>
        <AppInput<PasswordSettingDTO>
          control={control}
          name="new_password"
          rules={formRules.new_password}
          placeholder={t('PASSWORD')}
          secureTextEntry={!showNewPassword}
          errors={errors}
          rightIcon={
            <PasswordToggle
              onToggle={() => setShowNewPassword(prev => !prev)}
              showPassword={showNewPassword} />
          }
        />
        <AppText>Confirm Password</AppText>
        <AppInput<PasswordSettingDTO>
          control={control}
          name="confirm_password"
          rules={formRules.confirm_password}
          placeholder={t('PASSWORD')}
          secureTextEntry={!showConfirmPassword}
          errors={errors}
          rightIcon={
            <PasswordToggle
              onToggle={() => setShowConfirmPassword(prev => !prev)}
              showPassword={showConfirmPassword} />
          }
        />
        <AppButton title={loading ? t('LOADING...') : t('CHANGE PASSWORD')} onPress={handleSubmit(handleChangePassword)} disabled={loading} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flexDirection: 'column',
    gap: 12,
    paddingTop: 12
  },
});

export default PasswordSetting;
