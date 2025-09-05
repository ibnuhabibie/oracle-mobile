import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useMemo } from 'react';
import {
  Image,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
import { AppText } from '../../../components/ui/app-text';
import { scaleFont, scaleSize } from '../../../utils/scale';

import ScreenContainer from '../../../components/layouts/screen-container';
import Header from '../../../components/ui/header';
import { MainNavigatorParamList } from '../../../navigators/types';
import ProfileCard from '../../../features/profile/report/profile-card';
import ProfileItemCard from '../../../features/profile/report/profile-item-card';
import Ascendant from '../../../components/icons/planet/ascendant';
import Chiron from '../../../components/icons/planet/chiron';
import Jupiter from '../../../components/icons/planet/jupiter';
import Mars from '../../../components/icons/planet/mars';
import Mercury from '../../../components/icons/planet/mercury';
import Moon from '../../../components/icons/planet/moon';
import Neptune from '../../../components/icons/planet/neptune';
import NorthNode from '../../../components/icons/planet/northnode';
import Pluto from '../../../components/icons/planet/pluto';
import Saturn from '../../../components/icons/planet/saturn';
import Sun from '../../../components/icons/planet/sun';
import Uranus from '../../../components/icons/planet/uranus';
import Venus from '../../../components/icons/planet/venus';
import { COLORS } from '../../../constants/colors';

type AstrologyResultsProps = NativeStackScreenProps<MainNavigatorParamList, 'AstrologyResults'>;

const AstrologyResults: FC<AstrologyResultsProps> = ({ navigation, route }) => {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => setReady(true));
    return () => interaction && interaction.cancel && interaction.cancel();
  }, []);

  // Get profile_astro from route params
  const profile = useMemo(() => {
    // Sort by order if present
    const profileAstro = route.params?.profile_astro as Record<string, any> | undefined;
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
  const planetIcons = {
    ascendant: Ascendant,
    chiron: Chiron,
    jupiter: Jupiter,
    mars: Mars,
    mercury: Mercury,
    moon: Moon,
    neptune: Neptune,
    'north node': NorthNode,
    pluto: Pluto,
    saturn: Saturn,
    sun: Sun,
    uranus: Uranus,
    venus: Venus,
  };

  const defaultPlanetIcon = Sun;

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
                title: `${item.title}`,
                subtitle: `${item.subtitle}`,
                description: item.description,
                icon: (
                  React.createElement(iconSource, { size: scaleSize(100, 60, 140) })
                ),
              }}
            />
          );
        })}
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
          title="Astrology"
          onBack={() => navigation.goBack()}
        />
      }
    >
      {ready ? (
        <>
          <ProfileCard iconKey={profile?.sun?.zodiac || ""} cardTitle='You' />
          <AstrologyCardList profile={profile} />
        </>
      ) : (
        <ActivityIndicator size="large" style={{ margin: scaleSize(32) }} color={COLORS.primary} />
      )}
    </ScreenContainer>
  );
};

export default AstrologyResults;
