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
import SignUpForm from '../../features/auth/signup-form';

const SignUp: FC<{
  navigation: NativeStackNavigationProp<MainNavigatorParamList, 'SignUp'>;
}> = ({ navigation }) => {


  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <Text style={styles.intro}>DEAR SEEKERS</Text>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>
        The cosmos whispers.{'\n'}Join & uncover your destiny.
      </Text>

      <SignUpForm />

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
