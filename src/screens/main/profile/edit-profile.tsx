import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';

import ArrowIcon from '../../../components/icons/Arrow';
import ScreenContainer from '../../../components/layouts/ScreenContainer';
import { fontFamilies } from '../../../constants/fonts';
import ProfileForm from '../../../features/profile/profile-form';
import api from '../../../utils/http';
import type { ProfileFormData } from '../../../features/profile/profile-form';
import { MainNavigatorParamList } from '../../../navigators/types';
import { COLORS } from '../../../constants/colors';


type EditProfileProps = NativeStackScreenProps<MainNavigatorParamList, 'EditProfile'>;

const EditProfile: FC<EditProfileProps> = ({ navigation }) => {

  const onSubmit = async (data: ProfileFormData) => {
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
        birth_country: data.birth_country?.name,
        birth_city: data.birth_city?.name,
        birth_lat: data.birth_city?.latitude,
        birth_lng: data.birth_city?.longitude
      })

      await AsyncStorage.setItem('user_profile', JSON.stringify(res.data));
      Alert.alert(
        'Update Profile',
        'Successfully update your profile.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log(error)
    }
  };

  const { t } = useTranslation();

  return (
    <ScreenContainer
      header={
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowIcon />
          </Pressable>
          <Text style={styles.headerTitle}>{t("Edit Profile")}</Text>
        </View>
      }
    >
      <ProfileForm onSubmit={onSubmit} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingLeft: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: COLORS.white,
    paddingTop: 8,
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
});

export default EditProfile;
