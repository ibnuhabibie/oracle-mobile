import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { AppText } from '../../../components/ui/app-text';
import Header from '../../../components/ui/header';
import ScreenContainer from '../../../components/layouts/screen-container';
import ProfileCard from '../../../components/report/profile-card';
import ProfileItemCard from '../../../components/report/profile-item-card';

import BaziResultIcon1 from '../../../components/icons/bazi-result/bazi-result-icon-1';
import BaziResultIcon2 from '../../../components/icons/bazi-result/bazi-result-icon-2';
import BaziResultIcon3 from '../../../components/icons/bazi-result/bazi-result-icon-3';
import BaziResultIcon4 from '../../../components/icons/bazi-result/bazi-result-icon-4';
import BaziResultIcon5 from '../../../components/icons/bazi-result/bazi-result-icon-5';

import { ProfileIcon } from '../../../hooks/use-affinity-profile';

import { scaleSize } from '../../../utils/scale';

import type { MainNavigatorParamList } from '../../../navigators/types';

type BaziResultsProps = NativeStackScreenProps<MainNavigatorParamList, 'BaziResults'>;

const BaziResults: FC<BaziResultsProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const profile = route.params?.profile_bazi;

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
      <AppText variant="body1" color="red" style={{ margin: scaleSize(16) }}>{t('baziResult.emptyStateLabel')}</AppText>
    );
  }

  return (
    <ScreenContainer
      header={
        <Header
          title={t('baziResult.title')}
          onBack={() => navigation.goBack()}
        />
      }
    >
      <ProfileCard iconKey={profile?.day_master?.icon} cardTitle={t('profileCard.you')} />
      <BaziCardList profile={profile} iconImages={iconImages} />
    </ScreenContainer>
  );
};

export default BaziResults;
