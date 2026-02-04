import React, { FC } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import Carousel from 'react-native-reanimated-carousel';

import ServiceCard from './service-card';
import ScreenContainer from '../../../components/layouts/screen-container';
import ProfileDashboard from './profile-dashboard';
import { AppText } from '../../../components/ui/app-text';
import { useAffinityProfile } from '../profile/useAffinityProfile';
import { scaleFont, scaleSize } from '../../../utils/scale';

import type { HomeProps, CarouselItem } from './types';


const Home: FC<HomeProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const progress = useSharedValue<number>(0);

  const MAX_WIDTH = 430;
  const isWeb = Platform.OS === "web";

  const window = isWeb
    ? { width: MAX_WIDTH, height: 800, scale: 1, fontScale: 1 }
    : Dimensions.get("screen");

  const carouselItems: CarouselItem[] = [
    {
      id: 'love',
      title: t('carousel.love.title'),
      subtitle: t('carousel.love.subtitle'),
      path: 'LoveForecast'
    },
    {
      id: 'relation',
      title: t('carousel.relation.title'),
      subtitle: t('carousel.relation.subtitle'),
      path: 'RelationReport'
    },
    {
      id: 'fortune',
      title: t('carousel.fortune.title'),
      subtitle: t('carousel.fortune.subtitle'),
      path: 'FortuneReport'
    },
    {
      id: 'myReport',
      title: t('carousel.myReport.title'),
      subtitle: t('carousel.myReport.subtitle'),
      path: 'PurchaseHistory'
    },
    {
      id: 'baziReport',
      title: t('carousel.baziReport.title'),
      subtitle: t('carousel.baziReport.subtitle'),
      path: 'BaziResults'
    },
    {
      id: 'astroReport',
      title: t('carousel.astroReport.title'),
      subtitle: t('carousel.astroReport.subtitle'),
      path: 'AstrologyResults'
    },
    {
      id: 'mbtiReport',
      title: t('carousel.mbtiReport.title'),
      subtitle: t('carousel.mbtiReport.subtitle'),
      path: 'MbtiQuiz'
    },
  ];

  const carouselOffset = Platform.OS === 'ios' && Platform.isPad
    ? 280
    : 190;


  const {
    data: affinityProfile,
  } = useAffinityProfile();

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <View style={styles.header}>
        <ProfileDashboard />
        <AppText style={styles.subtitle} color='neutral' variant='subtitle1'>
          {t('home.subtitle')}
        </AppText>
      </View>
      <View
        id="carousel-component"
        style={styles.carouselContainer}
      >
        <Carousel
          autoPlayInterval={2000}
          data={carouselItems}
          height={scaleSize(550)}
          loop={true}
          pagingEnabled={true}
          snapEnabled={true}
          width={window.width}
          style={styles.carouselStyle}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.6,
            parallaxScrollingOffset: scaleSize(carouselOffset),
          }}
          onProgressChange={progress}
          renderItem={
            ({ item }) => (
              <ServiceCard data={item} navigation={navigation} navigationData={affinityProfile} />
            )
          }
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: scaleSize(18),
    paddingBottom: 0,
  },
  subtitle: {
    textAlign: 'center',
    letterSpacing: scaleSize(2.5, 1, 5),
    lineHeight: scaleSize(20, 16, 24),
    marginTop: scaleSize(16, 10, 24),
    textTransform: 'uppercase',
    fontSize: scaleFont(16, 12, 20),
  },
  carouselContainer: {
    marginTop: scaleSize(-80, -80, 0),
    overflow: 'hidden',
    height: scaleSize(450),
  },
  carouselStyle: {
    // width will be set dynamically in render
  },
});

export default Home;