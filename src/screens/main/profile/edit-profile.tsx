import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import {
  Alert,
} from 'react-native';
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';

import ScreenContainer from '../../../components/layouts/screen-container';
import Header from '../../../components/ui/header';
import ProfileForm from '../../../features/profile/profile-form';
import api from '../../../utils/http';
import type { ProfileFormData } from '../../../features/profile/profile-form';
import { MainNavigatorParamList } from '../../../navigators/types';


type EditProfileProps = NativeStackScreenProps<MainNavigatorParamList, 'EditProfile'>;

const EditProfile: FC<EditProfileProps> = ({ navigation }) => {

  const { t, i18n } = useTranslation();

  const onSubmit = async (data: ProfileFormData) => {
    try {
      let birth_date = data.birth_date.toISOString().split('T')[0];
      let birth_time = `${data.birth_time.getHours().toString().padStart(2, '0')}:${data.birth_time.getMinutes().toString().padStart(2, '0')}:${data.birth_time.getSeconds().toString().padStart(2, '0')}`;

      const payload = {
        full_name: data.full_name,
        email: data.email,
        mobile_phone: data.phone_number,
        gender: data.gender,
        birth_date,
        birth_time,
        birth_country: data.birth_country?.name,
        birth_city: data.birth_city?.name,
        birth_lat: data.birth_city?.latitude,
        birth_lng: data.birth_city?.longitude,
        locale: data.language
      }

      console.log(payload)

      const res = await api.put('/v1/users', payload)

      await AsyncStorage.setItem('user_profile', JSON.stringify(res.data));

      // Update i18n language
      if (data.language) {
        i18n.changeLanguage(data.language);
      }

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

  return (
    <ScreenContainer
      header={
        <Header
          title={t("Edit Profile")}
          onBack={() => navigation.goBack()}
        />
      }
    >
      <ProfileForm onSubmit={onSubmit} />
    </ScreenContainer>
  );
};

export default EditProfile;
