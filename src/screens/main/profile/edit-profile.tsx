import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ArrowIcon from '../../../components/icons/Arrow';
import ScreenContainer from '../../../components/layouts/ScreenContainer';
import { COLORS } from '../../../constants/colors';
import { fontFamilies } from '../../../constants/fonts';
import ProfileForm from '../../../features/profile/profile-form';
import api from '../../../utils/http';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FormData {
  full_name: string;
  email: string;
  phone_number: string;
  birth_date: Date;
  birth_time: Date;
  gender: 'male' | 'female';
  birth_country: string;
  birth_city: string;
}

const EditProfile: FC<{
  navigation: NativeStackNavigationProp<any, 'EditProfile'>;
}> = ({ navigation }) => {

  const onSubmit = async (data: FormData) => {
    try {
      let birth_date = data.birth_date.toISOString().split('T')[0];
      let birth_time = data.birth_time.toISOString().split('T')[1].split('.')[0];

      const res = await api.put('/v1/users', {
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number,
        gender: data.gender,
        birth_date,
        birth_time,
        birth_country: data.birth_country.name,
        birth_city: data.birth_city.name,
        birth_lat: data.birth_city.latitude,
        birth_lng: data.birth_city.longitude
      })

      await AsyncStorage.setItem('user_profile', JSON.stringify(res.data));
      navigation.goBack();
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowIcon />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ProfileForm onSubmit={onSubmit} />

    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 20,
    textAlign: 'center',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#333',
  },
  textField: {
    width: '100%',
    marginBottom: 0,
  },
  dateTimeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f9f9f9',
  },
  dateTimeText: {
    fontSize: 16,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: COLORS.black,
  },
  dateTimeIcon: {
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  radioContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#c1976b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c1976b',
  },
  radioText: {
    fontSize: 16,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#333',
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#c1976b',
    marginTop: 8,
  },
});

export default EditProfile;
