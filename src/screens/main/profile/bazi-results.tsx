import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator, ScrollView, Image } from 'react-native';

import ArrowIcon from '../../../components/icons/Arrow';
import ScreenContainer from '../../../components/layouts/ScreenContainer';
import ShinyContainer from '../../../components/widgets/ShinyContainer';
import { fontFamilies } from '../../../constants/fonts';
import { MainNavigatorParamList } from '../../../navigators/types';
import ProfileCard from '../../../features/profile/report/profile-card';
import ProfileItemCard from '../../../features/profile/report/profile-item-card';
import api from '../../../utils/http';

type BaziResultsProps = NativeStackScreenProps<MainNavigatorParamList, 'AstrologyResults'>;

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

  const renderProfileItem = (item: any, fallbackTitle: string, index: number) => {
    if (!item) return null;
    return (
      <ProfileItemCard
        data={{
          title: item.name || fallbackTitle,
          description: item.description,
          icon: iconImages[index - 1] ? (
            <Image
              source={iconImages[index - 1]}
              style={{ width: 48, height: 48, marginBottom: 8 }}
              resizeMode="contain"
            />
          ) : undefined,
        }}
      />
    );
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowIcon />
        </Pressable>
        <Text style={styles.headerTitle}>BaZi Profile</Text>
      </View>

      <ProfileCard iconType="bazi" />

      {loading ? (
        <ActivityIndicator size="large" color="#D4A574" style={{ marginTop: 32 }} />
      ) : error ? (
        <Text style={{ color: 'red', margin: 16 }}>{error}</Text>
      ) : profile ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {renderProfileItem(profile.day_master, 'Day Master', 1)}
          {renderProfileItem(profile.pillar_day, 'Day Pillar', 2)}
          {renderProfileItem(profile.pillar_month, 'Month Pillar', 3)}
          {renderProfileItem(profile.pillar_year, 'Year Pillar', 4)}
          {renderProfileItem(profile.pillar_hour, 'Hour Pillar', 5)}
        </ScrollView>
      ) : null}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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

export default BaziResults;
