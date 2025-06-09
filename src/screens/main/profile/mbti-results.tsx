/* eslint-disable react-native/no-inline-styles */
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import ArrowIcon from '../../../components/icons/Arrow';
import ScreenContainer from '../../../components/layouts/ScreenContainer';
import ShinyContainer from '../../../components/widgets/ShinyContainer';
import {COLORS} from '../../../constants/colors';
import {fontFamilies} from '../../../constants/fonts';
import {MainNavigatorParamList} from '../../../navigators/main-navigator';

interface MbtiResultsProps {
  navigation: NativeStackNavigationProp<MainNavigatorParamList, 'MbtiResults'>;
}

const MbtiResults: FC<MbtiResultsProps> = ({navigation}) => {
  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowIcon />
          </Pressable>
          <Text style={styles.headerTitle}>MBTI</Text>
        </View>

        {/* Main MBTI Type */}
        <ShinyContainer size={218}>
          <Text style={{color: COLORS.white, fontSize: 30}}>INTJ</Text>
        </ShinyContainer>

        {/* The Architect Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>🏛️</Text>
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>The Architect</Text>
              <Text style={styles.cardSubtitle}>
                Imaginative and strategic thinkers, with a plan for everything.
              </Text>
            </View>
          </View>
        </View>

        {/* Strengths Card */}
        <View style={styles.card}>
          <ShinyContainer dark={false} size={240} style={{marginTop: 8}}>
            <Text style={styles.iconText}>💪</Text>
          </ShinyContainer>
          <Text style={styles.sectionTitle}>Strengths</Text>
          <Text style={styles.sectionDescription}>
            Rational and Quick-witted, Independent and Decisive, High
            Self-Confidence, Hard-working and Determined, Open-minded,
            Jack-of-all-trades
          </Text>
        </View>

        {/* Weaknesses Card */}
        <View style={styles.card}>
          <ShinyContainer dark={false} size={240}>
            <Text style={styles.iconText}>⚠️</Text>
          </ShinyContainer>
          <Text style={styles.sectionTitle}>Weaknesses</Text>
          <Text style={styles.sectionDescription}>
            Overly Analytical, Arrogant, Judgemental, Overly Critical, Combative
          </Text>
        </View>

        {/* Relationships Card */}
        <View style={styles.card}>
          <ShinyContainer dark={false} size={240}>
            <Text style={styles.iconText}>💕</Text>
          </ShinyContainer>
          <Text style={styles.sectionTitle}>Relationships</Text>
          <Text style={styles.sectionDescription}>
            INTJs are independent and selective in their relationships. They
            seek intellectual compatibility and deep connections.
          </Text>
        </View>

        {/* Career Card */}
        <View style={[styles.card, {marginBottom: 32}]}>
          <ShinyContainer dark={false} size={240}>
            <Text style={styles.iconText}>💼</Text>
          </ShinyContainer>
          <Text style={styles.sectionTitle}>Career</Text>
          <Text style={styles.sectionDescription}>
            INTJs excel in strategic planning, scientific research, engineering,
            and leadership roles.
          </Text>
        </View>
      </ScrollView>
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
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 20,
    textAlign: 'center',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  mainTypeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  radiatingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#FAFAFA',
  },
  centerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mbtiType: {
    fontSize: 24,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#FFF',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    marginTop: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6A6A6A',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconPlaceholder: {
    width: 78,
    height: 84,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: COLORS.black,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 16,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: COLORS.black,
    lineHeight: 20,
  },
  radiatingCircleSmall: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
  },
  centerCircleSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#D4A574',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
});

export default MbtiResults;
