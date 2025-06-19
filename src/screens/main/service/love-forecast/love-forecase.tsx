import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { AppText } from '../../../../components/ui/app-text';
import { COLORS } from '../../../../constants/colors';
import ArrowIcon from '../../../../components/icons/Arrow';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../../../../navigators/types';
import { fontFamilies } from '../../../../constants/fonts';
import { AppButton } from '../../../../components/ui/app-button';
import ShinyContainer from '../../../../components/widgets/ShinyContainer';
import LoveForecastForm, { LoveForecastFormValues } from '../../../../features/love-forecast-form';

type LoveForecastProps = NativeStackScreenProps<MainNavigatorParamList, 'LoveForecast'>;

const CARD_DATA = [
  {
    icon: require('../../../../assets/love-forecast/icon-1.png'), label: 'Introduction: Your love blueprint'
  },
  {
    icon: require('../../../../assets/love-forecast/icon-2.png'), label: 'What are you lacking in love?'
  },
  {
    icon: require('../../../../assets/love-forecast/icon-3.png'), label: 'What you look out for in a partner'
  },
  {
    icon: require('../../../../assets/love-forecast/icon-4.png'), label: 'What type of partner suits you'
  },
  {
    icon: require('../../../../assets/love-forecast/icon-5.png'), label: 'Love outlook for the year'
  },
  {
    icon: require('../../../../assets/love-forecast/icon-6.png'), label: 'Where to find love'
  },
  {
    icon: require('../../../../assets/love-forecast/icon-7.png'), label: 'Personalized questions'
  },
  {
    icon: require('../../../../assets/love-forecast/icon-8.png'), label: 'Conclusion: Your love story ahead'
  },
];

const LoveForecast: React.FC<LoveForecastProps> = ({ navigation }) => {
  const [showForm, setShowForm] = useState(true);
  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowIcon />
          </Pressable>
          <Text style={styles.headerTitle}>Love Forecast for Next 12 Months</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 90 }]} showsVerticalScrollIndicator={false}>
        <View style={{ height: 80 }} />
        <AppText variant='subtitle1' style={styles.title}>EMOTIONAL CONFUSION? GET IT{'\n'}RESOLVED IN ONE GO.</AppText>
        <ShinyContainer dark={false} size={220}>
          <Image source={require('../../../../assets/love-forecast/service-icon.png')} />
        </ShinyContainer>
        <AppText style={styles.subtitle} variant='title3' color='primary'>
          Four key directions to help you overcome emotional challenges.
        </AppText>
        <AppText style={styles.description} color='neutral'>
          Discover the basis of your emotional confusion and find the right direction for your love life. Get answers on all aspects in one go: mindset, love forecast, how to find love, and a glimpse of things ahead.
        </AppText>
        <AppText style={styles.sectionTitle} variant='subtitle1' color='primary'>WHAT YOU WILL FIND OUT:</AppText>

        <View style={styles.grid}>
          {
            CARD_DATA.map((card, idx) => (
              <View key={idx} style={styles.card}>
                <View style={styles.cardIconWrapper}>
                  <ShinyContainer dark={false}>
                    <Image source={card.icon} style={{ width: 44, height: 44, resizeMode: 'contain' }} />
                  </ShinyContainer>
                </View>
                <AppText style={styles.cardLabel} color='primary'>{card.label}</AppText>
              </View>
            ))
          }
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
      {/* Absolute Purchase Button at Bottom */}
      <View style={styles.purchaseButtonAbsolute}>
        {!showForm ? (
          <AppButton
            title="Purchase for 15 💛"
            variant="primary"
            onPress={() => setShowForm(true)}
          />
        ) : (
          <LoveForecastForm
            onSubmit={(values: LoveForecastFormValues) => {
              // handle form submission here (e.g., call API, show success, etc.)
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 18,
    letterSpacing: 0.2,
  },
  centerIconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  sunburst: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF7E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: '100%',
    marginVertical: 12,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  purchaseButtonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
  },
  purchaseButtonAbsolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    padding: 12,
    zIndex: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.black,
    width: '48%'
  },
  cardIconWrapper: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    marginTop: 12
  },
});

export default LoveForecast;
