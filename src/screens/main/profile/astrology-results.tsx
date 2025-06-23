import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import ArrowIcon from '../../../components/icons/Arrow';
import ScreenContainer from '../../../components/layouts/ScreenContainer';
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
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowIcon />
          </Pressable>
          <AppText style={styles.headerTitle}>Astrology</AppText>
        </View>
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
  profileCard: {
    backgroundColor: 'rgba(255, 200, 138, 0.22)',
    borderRadius: 10,
    padding: 20,
    marginTop: 32,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0D0C0',
  },
  zodiacIcon: {
    fontSize: 32,
    color: '#333',
  },
  profileInfo: {
    width: '100%',
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D0C0B0',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#333',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  celestialIcon: {
    fontSize: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#D4A574',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
});

export default AstrologyResults;
