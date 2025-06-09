import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import ScreenContainer from '../../components/layouts/ScreenContainer';
import {MainNavigatorParamList} from '../../navigators/main-navigator';
import {COLORS} from '../../constants/colors';
import WealthIcon from '../../components/icons/aspect/Wealth';
import LearningIcon from '../../components/icons/aspect/Learning';
import RelationIcon from '../../components/icons/aspect/Relation';
import CareerIcon from '../../components/icons/aspect/Career';
import {fontFamilies} from '../../constants/fonts';

const Home: FC<{
  navigation: NativeStackNavigationProp<MainNavigatorParamList, 'Home'>;
}> = ({}) => {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.date}>Wed, 30 Apr 2025</Text>
        <Text style={styles.greeting}>Good Day, Jessica</Text>
      </View>
      <View style={{width: '100%', paddingHorizontal: 25}}>
        <Text style={styles.title}>90%</Text>
        <Text style={styles.subtitle}>TODAY SCORE</Text>
        <Text style={styles.paragraph}>
          Today is ideal for activities focused on removal, cleansing, and
          endings, such as surgeries, breaking bad habits, or starting a diet.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <Aspect text={'Wealth'}>
            <WealthIcon />
          </Aspect>
          <Aspect text={'Learning'}>
            <LearningIcon />
          </Aspect>
          <Aspect text={'Relation'}>
            <RelationIcon />
          </Aspect>
          <Aspect text={'Career'}>
            <CareerIcon />
          </Aspect>
        </View>
      </View>
      <Text style={{...styles.subtitle, marginTop: 40}}>
        WHAT DO YOU LIKE TO KNOW TODAY?
      </Text>
    </ScreenContainer>
  );
};

const Aspect: React.FC<{
  size?: number;
  children?: React.ReactNode;
  text: string;
}> = ({children, size = 52, text}) => (
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
          transform: [{translateX: '-50%'}, {translateY: '-50%'}],
          zIndex: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [{translateX: '-50%'}, {translateY: '-50%'}],
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
