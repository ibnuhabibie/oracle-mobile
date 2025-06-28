import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useMemo } from 'react';
import {
  Image,
  Text,
} from 'react-native';

import ScreenContainer from '../../../components/layouts/screen-container';
import Header from '../../../components/ui/header';
import { MainNavigatorParamList } from '../../../navigators/types';
import ProfileCard from '../../../features/profile/report/profile-card';
import ProfileItemCard from '../../../features/profile/report/profile-item-card';

type AstrologyResultsProps = NativeStackScreenProps<MainNavigatorParamList, 'AstrologyResults'>;

const AstrologyResults: FC<AstrologyResultsProps> = ({ navigation, route }) => {
  // Get profile_astro from route params
  const profile = useMemo(() => {
    // Sort by order if present
    const profileAstro = route.params?.profile_astro;
    if (profileAstro && typeof profileAstro === "object") {
      const sortedEntries = Object.entries(profileAstro)
        .sort(([, a], [, b]) => {
          const orderA = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
          const orderB = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
          return orderA - orderB;
        });
      return Object.fromEntries(sortedEntries);
    }
    return profileAstro;
  }, [route.params?.profile_astro]);

  // Planet icon mapping for dynamic icon loading
  const planetIcons: Record<string, any> = {
    ascendant: require('../../../assets/icons/planet/ascendant.png'),
    jupiter: require('../../../assets/icons/planet/jupiter.png'),
    mars: require('../../../assets/icons/planet/mars.png'),
    mercury: require('../../../assets/icons/planet/mercury.png'),
    moon: require('../../../assets/icons/planet/moon.png'),
    neptune: require('../../../assets/icons/planet/neptune.png'),
    'north node': require('../../../assets/icons/planet/north_node.png'),
    pluto: require('../../../assets/icons/planet/pluto.png'),
    saturn: require('../../../assets/icons/planet/saturn.png'),
    sun: require('../../../assets/icons/planet/sun.png'),
    uranus: require('../../../assets/icons/planet/uranus.png'),
    venus: require('../../../assets/icons/planet/venus.png'),
  };
  const defaultPlanetIcon = require('../../../assets/icons/planet/sun.png');

  // Card list component
  const AstrologyCardList: FC<{ profile: any }> = ({ profile }) => {
    if (!profile) return null;
    return (
      <>
        {Object.keys(profile).map((key) => {
          const item = profile[key];
          const iconKey = (item.icon || '').toLowerCase();
          const iconSource = planetIcons[iconKey] || defaultPlanetIcon;
          return (
            <ProfileItemCard
              key={key}
              data={{
                title: item.name || key,
                description: item.description,
                icon: (
                  <Image
                    source={iconSource}
                    resizeMode="contain"
                    style={{ width: 100, height: 100 }}
                  />
                ),
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
      <ProfileCard iconKey={profile?.sun?.zodiac || ""} />

      {profile ? (
        <AstrologyCardList profile={profile} />
      ) : (
        <Text style={{ color: 'red', margin: 16 }}>No profile data found.</Text>
      )}
    </ScreenContainer>
  );
};

export default AstrologyResults;
