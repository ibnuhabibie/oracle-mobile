import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { MainNavigatorParamList } from '../../navigators/types';
import { COLORS } from '../../constants/colors';
import { fontFamilies } from '../../constants/fonts';
import WealthIcon from '../../components/icons/profile-daily/Wealth';
import LearningIcon from '../../components/icons/profile-daily/Learning';
import RelationIcon from '../../components/icons/profile-daily/Relation';
import CareerIcon from '../../components/icons/profile-daily/Career';
import ScreenContainer from '../../components/layouts/ScreenContainer';
import ProfileDashboard from '../../features/profile/profile-dashboard';

type HomeProps = NativeStackScreenProps<MainNavigatorParamList, 'Home'>;

const Home: FC<HomeProps> = ({ navigation }) => {
  return (
    <ScreenContainer>
      <ProfileDashboard />
      <Text style={{ ...styles.subtitle, marginTop: 40 }}>
        WHAT DO YOU LIKE TO KNOW TODAY?
      </Text>
    </ScreenContainer>
  );
};

const Aspect: React.FC<{
  size?: number;
  children?: React.ReactNode;
  text: string;
}> = ({ children, size = 52, text }) => (
  <View>
    <View
      style={{
        position: 'relative',
        height: size,
        flexDirection: 'column',
      }}>
      <Image
        source={require('../../assets/images/crest-frame.png')}
        style={{
          width: size,
          height: size,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
          zIndex: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
          zIndex: 99,
        }}>
        {children}
      </View>
    </View>
    <Text style={styles.aspectText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    alignContent: 'flex-start',
    flexDirection: 'column',
    marginBottom: 26,
    paddingVertical: 10,
    width: '100%',
  },
  date: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 18,
    color: COLORS.black,
  },
  title: {
    fontSize: 40,
    color: COLORS.black,
    fontFamily: fontFamilies.ARCHIVO.light,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 5,
    lineHeight: 24,
    fontFamily: fontFamilies.ARCHIVO.regular,
    width: '100%',
  },
  paragraph: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 15,
    color: COLORS.neutral,
    fontFamily: fontFamilies.ARCHIVO.light,
    textAlign: 'center',
  },
  aspectText: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 8,
  },
});

export default Home;
