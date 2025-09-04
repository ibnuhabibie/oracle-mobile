import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Dimensions, Platform, ScaledSize, StyleSheet, View } from 'react-native';
import { useTranslation } from "react-i18next";
import Carousel from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';

import ServiceCard from '../../components/widgets/service-card';
import { MainNavigatorParamList } from '../../navigators/types';
import ScreenContainer from '../../components/layouts/screen-container';
import ProfileDashboard from '../../features/profile/profile-dashboard';
import { AppText } from '../../components/ui/app-text';

type HomeProps = NativeStackScreenProps<MainNavigatorParamList, 'Home'>;


const Home: FC<HomeProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const progress = useSharedValue<number>(0);

  const MAX_WIDTH = 430;
  const isWeb = Platform.OS === "web";


  const window: ScaledSize = isWeb
    ? { width: MAX_WIDTH, height: 800, scale: 1, fontScale: 1 }
    : Dimensions.get("screen");

  const carouselItems: Array<{
    id: 'love' | 'fortune' | 'relation';
    title: string;
    subtitle: string;
    path: keyof MainNavigatorParamList;
  }> = [
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
    ];

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <View style={{ padding: 18, paddingBottom: 0 }}>
        <ProfileDashboard />
        <AppText style={styles.subtitle} color='neutral' variant='subtitle1'>
          {t("WHAT DO YOU LIKE TO KNOW TODAY?")}
        </AppText>
      </View>
      <View
        id="carousel-component"
        style={{ marginTop: -50, overflow: 'hidden', height: 450 }}
      >
        <Carousel
          autoPlayInterval={2000}
          data={carouselItems}
          height={550}
          loop={true}
          pagingEnabled={true}
          snapEnabled={true}
          width={window.width}
          style={{
            width: window.width,
          }}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.6,
            parallaxScrollingOffset: 200,
          }}
          onProgressChange={progress}
          renderItem={
            ({ item }) => (
              <ServiceCard data={item} navigation={navigation} />
            )
          }
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    textAlign: 'center',
    letterSpacing: 5,
    lineHeight: 24,
    marginTop: 24,
    textTransform: 'uppercase',
  },
});

export default Home;
