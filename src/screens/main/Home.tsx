import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from "react-i18next";

import CenterCarousel from '../../components/widgets/center-carousel';
import { MainNavigatorParamList } from '../../navigators/types';
import ScreenContainer from '../../components/layouts/screen-container';
import ProfileDashboard from '../../features/profile/profile-dashboard';
import { AppText } from '../../components/ui/app-text';
import ShinyContainer from '../../components/widgets/shiny-container';

type HomeProps = NativeStackScreenProps<MainNavigatorParamList, 'Home'>;

const CARD_WIDTH = 240;
const CARD_MARGIN = 24;
const CARD_HEIGHT = 280;
const CARD_HEIGHT_CENTER = 320;

const Home: FC<HomeProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const carouselItems = [
    {
      id: 'love',
      image: require('../../assets/icons/services/love-forecast/service-icon.png'),
      title: t('carousel.love.title'),
      subtitle: t('carousel.love.subtitle'),
      path: 'LoveForecast'
    },
    {
      id: 'relation',
      image: require('../../assets/icons/services/relation-report/service-icon.png'),
      title: t('carousel.relation.title'),
      subtitle: t('carousel.relation.subtitle'),
      path: 'RelationReport'
    },
    {
      id: 'fortune',
      image: require('../../assets/icons/services/fortune-report/service-icon.png'),
      title: t('carousel.fortune.title'),
      subtitle: t('carousel.fortune.subtitle'),
      path: 'FortuneReport'
    },
  ];

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <View style={{ padding: 18 }}>
        <ProfileDashboard />
        <AppText style={styles.subtitle} color='primary' variant='subtitle1'>
          {t("WHAT DO YOU LIKE TO KNOW TODAY?")}
        </AppText>
      </View>
      <CenterCarousel
        data={carouselItems}
        cardWidth={CARD_WIDTH}
        cardHeight={CARD_HEIGHT}
        cardHeightCenter={CARD_HEIGHT_CENTER}
        gap={CARD_MARGIN}
        onCardPress={(item) => navigation.push(item.path)}
        renderItem={({ item, isCenter }) => (
          <>
            <View style={styles.cardImageContainer}>
              <ShinyContainer dark={false} size={190}>
                <Image source={item.image} />
              </ShinyContainer>
            </View>
            <View style={{ padding: 12 }}>
              <AppText variant='subtitle1' style={styles.cardTitle}>{item.title}</AppText>
              {
                isCenter
                  ? <AppText style={styles.cardSubtitle}>{item.subtitle}</AppText>
                  : null
              }
            </View>
          </>
        )}
        style={{ marginTop: 16 }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    textAlign: 'center',
    letterSpacing: 5,
    lineHeight: 24,
    marginTop: 40,
    textTransform: 'uppercase',
  },
  cardImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
  },
  cardTitle: {
    marginBottom: 6,
    marginTop: 4,
    textAlign: 'left'
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#D4A574',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default Home;
