import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import {
  Text,
  ActivityIndicator,
  Image
} from 'react-native';

import ScreenContainer from '../../../components/layouts/screen-container';
import Header from '../../../components/ui/header';
import { MainNavigatorParamList } from '../../../navigators/types';
import ProfileCard from '../../../features/profile/report/profile-card';
import ProfileItemCard from '../../../features/profile/report/profile-item-card';
import api from '../../../utils/http';

type BaziResultsProps = NativeStackScreenProps<MainNavigatorParamList, 'BaziResults'>;

const BaziResults: FC<BaziResultsProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/v1/users/affinity-profile');
        setProfile(res.data?.profile_bazi);
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
    require('../../../assets/icons/bazi/icon-1.png'),
    require('../../../assets/icons/bazi/icon-2.png'),
    require('../../../assets/icons/bazi/icon-3.png'),
    require('../../../assets/icons/bazi/icon-4.png'),
    require('../../../assets/icons/bazi/icon-5.png'),
  ];

  // Card list component
  const BaziCardList: FC<{ profile: any, iconImages: any[] }> = ({ profile, iconImages }) => {
    if (!profile) return null;
    const items = [
      { key: 'day_master', label: 'Day Master', iconIdx: 1 },
      { key: 'pillar_day', label: 'Day Pillar', iconIdx: 2 },
      { key: 'pillar_month', label: 'Month Pillar', iconIdx: 3 },
      { key: 'pillar_year', label: 'Year Pillar', iconIdx: 4 },
      { key: 'pillar_hour', label: 'Hour Pillar', iconIdx: 5 },
    ];

    return (
      <>
        {
          items.map(({ key, label, iconIdx }) => {
            const item = profile[key];
            if (!item) return null;
            return (
              <ProfileItemCard
                key={key}
                data={{
                  title: item.name || label,
                  description: item.description,
                  icon: iconImages[iconIdx - 1] ? (
                    <Image
                      source={iconImages[iconIdx - 1]}
                      style={{ width: 48, height: 48, marginBottom: 8 }}
                      resizeMode="contain"
                    />
                  ) : undefined,
                }}
              />
            );
          })
        }
      </>
    );
  };

  return (
    <ScreenContainer
      header={
        <Header
          title="BaZi Profile"
          onBack={() => navigation.goBack()}
        />
      }
    >
      <ProfileCard iconType="bazi" />

      {loading ? (
        <ActivityIndicator size="large" color="#D4A574" style={{ marginTop: 32 }} />
      ) : error ? (
        <Text style={{ color: 'red', margin: 16 }}>{error}</Text>
      ) : profile ? (
        <BaziCardList profile={profile} iconImages={iconImages} />
      ) : null}
    </ScreenContainer>
  );
};

export default BaziResults;
