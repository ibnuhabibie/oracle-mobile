import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { scaleFont, scaleSize } from '../../utils/scale';
import { AppText } from '../ui/app-text';
import ShinyContainer from './shiny-container';
import LoveReportIcon from '../icons/services/love-report/love-report-icon';
import FortuneReportIcon from '../icons/services/fortune-report/fortune-report-icon';
import RelationReportIcon from '../icons/services/relation-report/relation-report-icon';
import { ProfileIcon } from '../../screens/main/profile/useAffinityProfile';
import getMbtiIconComponent from '../../features/mbti/mbti-profile-item';
import { COLORS } from '../../constants/colors';
import { useAsyncStorage } from '../../hooks/use-storage';
import RelationReportIcon1 from '../icons/services/relation-report/relation-report-icon-1';

type ServiceCardData = {
  id: 'love' | 'fortune' | 'relation' | 'myReport' | 'baziReport' | 'astroReport' | 'mbtiReport';
  title: string;
  subtitle: string;
  path: string;
};

type ServiceCardProps = {
  data: ServiceCardData;
  navigation: any;
  navigationData?: any;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ data, navigation, navigationData }) => {
  const { id, title, subtitle, path } = data;
  const [user, setUser] = useState<any>(null);
  const MbtiIcon = getMbtiIconComponent(user?.mbti_profile);

  const { getUserProfile } = useAsyncStorage();

  const init = async () => {
    const profile = await getUserProfile();
    setUser(profile);
  };

  useEffect(() => {
    init();
  }, []);

  const handleNavigation = () => {
    if (id === 'baziReport') {
      navigation.navigate(path, { profile_bazi: navigationData?.profile_bazi });
    } else if (id === 'astroReport') {
      navigation.navigate(path, { profile_astro: navigationData?.profile_astro });
    } else if (id === 'mbtiReport') {
      const newPath = user?.mbti_profile ? 'MbtiResults' : 'MbtiQuiz';
      navigation.navigate(newPath, { mbti_profile: user?.mbti_profile });
    } else {
      navigation.navigate(path);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleNavigation}
      style={styles.cardContainer}
    >
      <View>
        <ShinyContainer size={scaleSize(350)}>
          {id === 'love' && <LoveReportIcon size={scaleSize(100)} />}
          {id === 'fortune' && <FortuneReportIcon size={scaleSize(100)} />}
          {id === 'relation' && <RelationReportIcon size={scaleSize(100)} />}
          {id === 'myReport' && <RelationReportIcon1 size={scaleSize(100)} />}
          {
            id === 'baziReport' &&
            <ProfileIcon
              size={scaleSize(100)}
              name={navigationData?.profile_bazi?.day_master?.icon}
            />
          }
          {
            id === 'astroReport' &&
            <ProfileIcon
              size={scaleSize(100)}
              name={navigationData?.profile_astro?.sun?.zodiac}
            />
          }
          {
            id === 'mbtiReport' && MbtiIcon && (<MbtiIcon size={scaleSize(75)} />)
          }
        </ShinyContainer>
        <View style={styles.textContainer}>
          <AppText variant='largeTitle1' style={styles.cardTitle} color='white'>
            {title}
          </AppText>
          <AppText variant='title3' style={styles.cardSubtitle} color='primary'>
            {subtitle}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: scaleSize(12),
    flex: 1,
    paddingTop: scaleSize(32),
  },
  textContainer: {
    marginTop: scaleSize(24),
    padding: scaleSize(16),
  },
  cardTitle: {
    marginBottom: scaleSize(6),
    marginTop: scaleSize(4),
    textAlign: 'left',
    fontSize: scaleFont(34), // largeTitle1
  },
  cardSubtitle: {
    textTransform: 'uppercase',
    letterSpacing: scaleSize(1),
    fontSize: scaleFont(22), // title3
  },
});

export default ServiceCard;
