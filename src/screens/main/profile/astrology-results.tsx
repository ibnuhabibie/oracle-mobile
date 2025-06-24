import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import ArrowIcon from '../../../components/icons/arrow-icon';
import ScreenContainer from '../../../components/layouts/screen-container';
import Header from '../../../components/ui/header';
import { fontFamilies } from '../../../constants/fonts';
import { MainNavigatorParamList } from '../../../navigators/types';
import ProfileCard from '../../../features/profile/report/profile-card';
import api from '../../../utils/http';
import ProfileItemCard from '../../../features/profile/report/profile-item-card';
import { COLORS } from '../../../constants/colors';
import { AppText } from '../../../components/ui/app-text';

type AstrologyResultsProps = NativeStackScreenProps<MainNavigatorParamList, 'AstrologyResults'>;

const AstrologyResults: FC<AstrologyResultsProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/v1/users/affinity-profile');
        setProfile(res.data?.profile_astro);
      } catch (err: any) {
        setError(err?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Static icon images for indices 1-5
  const iconImages = [
    require('../../../assets/icons/astro/icon-1.png'),
    require('../../../assets/icons/astro/icon-2.png'),
    require('../../../assets/icons/astro/icon-3.png'),
    require('../../../assets/icons/astro/icon-4.png'),
    require('../../../assets/icons/astro/icon-5.png'),
    require('../../../assets/icons/astro/icon-6.png'),
    require('../../../assets/icons/astro/icon-7.png'),
    require('../../../assets/icons/astro/icon-8.png'),
    require('../../../assets/icons/astro/icon-9.png'),
    require('../../../assets/icons/astro/icon-10.png'),
    require('../../../assets/icons/astro/icon-11.png'),
  ];

  // Card list component
  const AstrologyCardList: FC<{ profile: any, iconImages: any[] }> = ({ profile, iconImages }) => {
    if (!profile) return null;
    return (
      <>
        {Object.keys(profile).map((key, idx) => {
          const item = profile[key];
          // Use item.order if present and in range, else fallback to idx+1
          const iconIdx =
            item && typeof item.order === 'number' && item.order >= 1 && item.order <= iconImages.length
              ? item.order
              : ((idx % iconImages.length) + 1);
          return (
            <ProfileItemCard
              key={key}
              data={{
                title: item.name || key,
                description: item.description,
                icon: iconImages[iconIdx - 1] ? (
                  <Image
                    source={iconImages[iconIdx - 1]}
                    // style={{ width: 48, height: 48, marginBottom: 8 }}
                    resizeMode="contain"
                  />
                ) : undefined,
              }}
            />
          );
        })}
      </>
    );
  };

  return (
    <ScreenContainer
      header={
        <Header
          title="Astrology"
          onBack={() => navigation.goBack()}
        />
      }
    >
      <ProfileCard iconType="astro" />

      {
        loading ? (
          <ActivityIndicator size="large" color="#D4A574" style={{ marginTop: 32 }} />
        ) : error ? (
          <Text style={{ color: 'red', margin: 16 }}>{error}</Text>
        ) : profile ? (
          <AstrologyCardList profile={profile} iconImages={iconImages} />
        ) : null
      }

    </ScreenContainer>
  );
};

export default AstrologyResults;
