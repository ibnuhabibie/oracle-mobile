import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import {
  Text,
  Image
} from 'react-native';

import ScreenContainer from '../../../components/layouts/screen-container';
import Header from '../../../components/ui/header';
import { MainNavigatorParamList } from '../../../navigators/types';
import ProfileCard from '../../../features/profile/report/profile-card';
import ProfileItemCard from '../../../features/profile/report/profile-item-card';
import { iconMap } from './useAffinityProfile';

type BaziResultsProps = NativeStackScreenProps<MainNavigatorParamList, 'BaziResults'>;

const BaziResults: FC<BaziResultsProps> = ({ navigation, route }) => {
  const profile = route.params?.profile_bazi;

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
                      source={iconMap[item.icon]}
                      style={{ width: 75, height: 75, marginBottom: 8 }}
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
      <ProfileCard iconKey={profile?.day_master?.icon} />

      {profile ? (
        <BaziCardList profile={profile} iconImages={iconImages} />
      ) : (
        <Text style={{ color: 'red', margin: 16 }}>No profile data found.</Text>
      )}
    </ScreenContainer>
  );
};

export default BaziResults;
