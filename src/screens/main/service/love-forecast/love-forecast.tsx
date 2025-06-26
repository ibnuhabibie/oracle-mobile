import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { AppText } from '../../../../components/ui/app-text';
import { COLORS } from '../../../../constants/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../../../../navigators/types';
import { AppButton } from '../../../../components/ui/app-button';
import ShinyContainer from '../../../../components/widgets/shiny-container';
import ScreenContainer from '../../../../components/layouts/screen-container';
import Header from '../../../../components/ui/header';
import PurchaseAlertModal from '../../../../components/ui/purchase-alert-modal';
import { useServiceCost } from '../../../../hooks/use-service-cost';
import CoinIcon from '../../../../components/icons/profile/coin-icon';
import api from '../../../../utils/http';

type LoveForecastProps = NativeStackScreenProps<MainNavigatorParamList, 'LoveForecast'>;

const CARD_DATA = [
  {
    icon: require('../../../../assets/icons/services/love-forecast/icon-1.png'), label: 'Introduction: Your love blueprint'
  },
  {
    icon: require('../../../../assets/icons/services/love-forecast/icon-2.png'), label: 'What are you lacking in love?'
  },
  {
    icon: require('../../../../assets/icons/services/love-forecast/icon-3.png'), label: 'What you look out for in a partner'
  },
  {
    icon: require('../../../../assets/icons/services/love-forecast/icon-4.png'), label: 'What type of partner suits you'
  },
  {
    icon: require('../../../../assets/icons/services/love-forecast/icon-5.png'), label: 'Love outlook for the year'
  },
  {
    icon: require('../../../../assets/icons/services/love-forecast/icon-6.png'), label: 'Where to find love'
  },
  {
    icon: require('../../../../assets/icons/services/love-forecast/icon-7.png'), label: 'Personalized questions'
  },
  {
    icon: require('../../../../assets/icons/services/love-forecast/icon-8.png'), label: 'Conclusion: Your love story ahead'
  },
];

const LoveForecast: React.FC<LoveForecastProps> = ({ navigation }) => {
  const [showPurchaseModal, setShowPurchaseModal] = React.useState(false);
  const [purchaseLoading, setPurchaseLoading] = React.useState(false);
  const { cost, creditType, loading: costLoading } = useServiceCost('love_report');

  const handleContinue = async () => {
    setPurchaseLoading(true);
    try {
      // You may want to pass user input as needed
      const response = await api.post('/v1/affinity/love-report', {});
      setShowPurchaseModal(false);
      // navigation.navigate('LoveForecastResult', { result: response });
      Alert.alert('Title', response.meta.message)
    } catch (err) {
      setShowPurchaseModal(false);
      // Optionally show error to user
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleCancel = () => {
    setShowPurchaseModal(false);
  };

  return (
    <ScreenContainer
      header={
        <Header
          title="Love Forecast for Next 12 Months"
          onBack={() => navigation.goBack()}
        />
      }
      floatingFooter={
        <AppButton
          title={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText color='white' style={{ marginRight: 4 }}>Purchase for {cost}</AppText>
              <CoinIcon color={creditType === 'gold' ? '#E0AE1E' : '#EB4335'} size={18} />
            </View>
          }
          variant="primary"
          onPress={() => setShowPurchaseModal(true)}
        />
      }
    >
      <AppText variant='subtitle1' style={styles.title}>EMOTIONAL CONFUSION? GET IT{'\n'}RESOLVED IN ONE GO.</AppText>
      <ShinyContainer dark={false} size={220} style={{ marginVertical: 20 }}>
        <Image source={require('../../../../assets/icons/services/love-forecast/service-icon.png')} />
      </ShinyContainer>
      <AppText style={styles.subtitle} variant='title4' color='primary'>
        Four key directions to help you{'\n'}overcome emotional{'\n'}challenges.
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
      <View style={{ height: 80 }} />
      <PurchaseAlertModal
        visible={showPurchaseModal}
        onContinue={handleContinue}
        onCancel={handleCancel}
        service="love_report"
        loading={purchaseLoading}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginBottom: 18,
    letterSpacing: 0.2,
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
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.2,
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
