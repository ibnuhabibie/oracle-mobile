/* eslint-disable react-native/no-inline-styles */
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EyeIcon from '../../components/icons/Eye';
import EyeCrossedIcon from '../../components/icons/EyeCrossed';
import ScreenContainer from '../../components/layouts/ScreenContainer';
import { Button } from '../../components/ui/button';
import TextField from '../../components/ui/text-field';
import { fontFamilies } from '../../constants/fonts';
import { MainNavigatorParamList } from '../../navigators/AuthNavigator';
import api from '../../utils/http';

import { API_BASE_URL } from '@env';

export interface LoginDTO {
  email: string;
  password: string
}

const SignIn: FC<{
  navigation: NativeStackNavigationProp<MainNavigatorParamList, 'SignIn'>;
}> = ({ navigation }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: 'john@example.com',
      password: 'password123',
    },
  });

  const formRules = {
    email: {
      required: 'Email is required',
      pattern: {
        value: /^\S+@\S+$/i,
        message: 'Invalid email format'
      }
    },
    password: {
      required: 'Password is required',
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters'
      }
    }
  }

  const onSubmit = async (data: LoginDTO) => {
    try {
      console.log('Sign in data:', data);
      const res = await api.post('/v1/users/auth/login', data)

      console.log(res)
      await AsyncStorage.setItem('auth_token', res.data.token);

      navigation.push('Otp', { email: res.data.email });
    } catch (error) {
      Alert.alert('Login Failed', error.meta.message)
      console.log(error)
    }
  };

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <Text style={styles.intro}>{t('DEAR SEAKERS')}</Text>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>
        The cosmos whispers.{'\n'}Discover what’s meant for you.
      </Text>

      <View style={{ flexDirection: 'column', gap: 12 }}>
        <View>
          <Controller
            control={control}
            name="email"
            rules={formRules.email}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={[styles.textField, errors.email && styles.inputError]}
                keyboardType="email-address"
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>
        <View>
          <Controller
            control={control}
            name="password"
            rules={formRules.password}
            render={({ field: { value, onChange } }) => (
              <TextField
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showPassword}
                style={[styles.textField, errors.password && styles.inputError]}
                rightIcon={
                  <Pressable onPress={() => setShowPassword(prev => !prev)}>
                    {showPassword ? (
                      <EyeCrossedIcon size={20} />
                    ) : (
                      <EyeIcon size={20} />
                    )}
                  </Pressable>
                }
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>
      </View>

      <Button
        title="Sign In"
        onPress={handleSubmit(onSubmit)}
        style={styles.signInButton}
      />

      <Text style={styles.footer}>
        Already have an account?{' '}
        <Text
          style={styles.signIn}
          onPress={() => navigation.navigate('SignUp')}>
          Sign Up
        </Text>
      </Text>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  intro: {
    fontSize: 14,
    color: '#c1976b',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 8,
    fontFamily: fontFamilies.ARCHIVO.light,
    width: '100%',
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#777',
    marginBottom: 24,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  footer: {
    textAlign: 'center',
    marginTop: 16,
    color: '#333',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  signInButton: {
    marginTop: 12,
    width: '100%',
  },
  signIn: {
    color: '#c1976b',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  textField: {
    width: '100%',
  },
  inputError: {
    borderColor: 'red'
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    padding: 4
  }
});

export default SignIn;
