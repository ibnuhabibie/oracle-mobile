import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import {
  Image,
  InteractionManager,
  ActivityIndicator
} from 'react-native';
import { AppText } from '../../../components/ui/app-text';
import { scaleFont, scaleSize } from '../../../utils/scale';

import ScreenContainer from '../../../components/layouts/screen-container';
import Header from '../../../components/ui/header';
import { MainNavigatorParamList } from '../../../navigators/types';
import ProfileCard from '../../../features/profile/report/profile-card';
import ProfileItemCard from '../../../features/profile/report/profile-item-card';
import { iconMap, ProfileIcon } from './useAffinityProfile';
import BaziResultIcon1 from '../../../components/icons/bazi-result/bazi-result-icon-1';
import BaziResultIcon2 from '../../../components/icons/bazi-result/bazi-result-icon-2';
import BaziResultIcon3 from '../../../components/icons/bazi-result/bazi-result-icon-3';
import BaziResultIcon4 from '../../../components/icons/bazi-result/bazi-result-icon-4';
import BaziResultIcon5 from '../../../components/icons/bazi-result/bazi-result-icon-5';
import { COLORS } from '../../../constants/colors';

type BaziResultsProps = NativeStackScreenProps<MainNavigatorParamList, 'BaziResults'>;

const BaziResults: FC<BaziResultsProps> = ({ navigation, route }) => {
  const profile = route.params?.profile_bazi;
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => setReady(true));
    return () => interaction && interaction.cancel && interaction.cancel();
  }, []);

  console.log(profile, 'profile')

  // Static icon components for indices 1-5
  const iconImages = [
    BaziResultIcon1,
    BaziResultIcon2,
    BaziResultIcon3,
    BaziResultIcon4,
    BaziResultIcon5,
  ];

  // Card list component
  const BaziCardList: FC<{ profile: any, iconImages: any[] }> = ({ profile, iconImages }) => {
    if (!profile) return null;

    const items = [
      { key: 'day_master', label: 'Day Master', iconIdx: 1 },
      { key: 'pillar_year', label: 'Year Pillar', iconIdx: 4 },
      { key: 'pillar_month', label: 'Month Pillar', iconIdx: 3 },
      { key: 'pillar_day', label: 'Day Pillar', iconIdx: 2 },
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
                  title: item.title || label,
                  subtitle: item.subtitle,
                  description: item.description,
                  icon: <ProfileIcon name={item.icon} size={scaleSize(75)} />
                }}
              />
            );
          })
        }
      </>
    );
  };

  if (!profile) {
    return (
      <AppText variant="body1" color="red" style={{ margin: scaleSize(16) }}>No profile data found.</AppText>
    );
  }

  return (
    <ScreenContainer
      header={
        <Header
          title="BaZi Profile"
          onBack={() => navigation.goBack()}
        />
      }
    >
      {ready ? (
        <>
          <ProfileCard iconKey={profile?.day_master?.icon} cardTitle='You' />
          <BaziCardList profile={profile} iconImages={iconImages} />
        </>
      ) : (
        <ActivityIndicator size="large" style={{ margin: scaleSize(32) }} color={COLORS.primary} />
      )}
    </ScreenContainer>
  );
};

export default BaziResults;
