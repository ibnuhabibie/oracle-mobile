/* eslint-disable react-native/no-inline-styles */
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import EyeIcon from '../../components/icons/Eye';
import EyeCrossedIcon from '../../components/icons/EyeCrossed';
import ScreenContainer from '../../components/layouts/ScreenContainer';
import { Button } from '../../components/ui/button';
import TextField from '../../components/ui/text-field';
import { MainNavigatorParamList } from '../../navigators/AuthNavigator';
import { fontFamilies } from '../../constants/fonts';
import api from '../../utils/http';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp: FC<{
  navigation: NativeStackNavigationProp<MainNavigatorParamList, 'SignUp'>;
}> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
      referral_code: '',
    },
  });

  const formRules = {
    full_name: {
      required: 'Name is required',
      minLength: {
        value: 2,
        message: 'Name must be at least 2 characters'
      }
    },
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
    },
    confirm_password: {
      required: 'Please confirm your password',
      validate: (value: string) =>
        value === getValues('password') || 'Passwords do not match'
    }
  };


  const onSubmit = async (data: any) => {
    try {
      console.log('Sign up data:', data);
      const res = await api.post('/v1/users/register', data)
      await AsyncStorage.setItem('auth_token', res.data.token);

      navigation.navigate('Otp', { email: res.data.email });
    } catch (error) {
      Alert.alert('Login Failed', error.meta.message)
      console.log(error)
    }
  };

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <Text style={styles.intro}>DEAR SEEKERS</Text>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>
        The cosmos whispers.{'\n'}Join & uncover your destiny.
      </Text>

      <View style={{ flexDirection: 'column', gap: 12 }}>
        <View>
          <Controller
            control={control}
            name="full_name"
            rules={formRules.full_name}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                placeholder="Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={[styles.textField, errors.full_name && styles.inputError]}
              />
            )}
          />
          {errors.full_name && (
            <Text style={styles.errorText}>{errors.full_name.message}</Text>
          )}
        </View>
        <View>
          <Controller
            control={control}
            name="email"
            rules={formRules.email}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                placeholder="Email"
                value={value}
                onChangeText={onChange}
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
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                style={[styles.textField, errors.password && styles.inputError]}
                secureTextEntry={!showPassword}
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
        <View>
          <Controller
            control={control}
            name="confirm_password"
            rules={formRules.confirm_password}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                placeholder="Confirm Password"
                value={value}
                onChangeText={onChange}
                style={[styles.textField, errors.confirm_password && styles.inputError]}
                secureTextEntry={!showConfirmPassword}
                rightIcon={
                  <Pressable
                    onPress={() => setShowConfirmPassword(prev => !prev)}>
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
          {errors.confirm_password && (
            <Text style={styles.errorText}>{errors.confirm_password.message}</Text>
          )}
        </View>
        <View>
          <Controller
            control={control}
            name="referral_code"
            render={({ field: { value, onChange } }) => (
              <TextField
                placeholder="Referral Code"
                value={value}
                onChangeText={onChange}
                style={styles.textField}
              />
            )}
          />
        </View>
      </View>

      <Button
        title="Create Account"
        onPress={handleSubmit(onSubmit)}
        style={styles.signInButton}
      />

      <Text style={styles.footer}>
        Already have an account?{' '}
        <Text
          style={styles.signIn}
          onPress={() => navigation.navigate('SignIn')}>
          Sign In
        </Text>
      </Text>
    </ScreenContainer>
  );
};

// TODO: globalize style or make the input and error as 1 component
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

export default SignUp;
