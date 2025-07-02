import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';

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
import PollingLoadingModal from '../../../../components/ui/polling-loading-modal';

type LoveForecastProps = NativeStackScreenProps<MainNavigatorParamList, 'LoveForecast'>;

/* CARD_DATA is now created inside the component */

const LoveForecast: React.FC<LoveForecastProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const CARD_DATA = [
    {
      icon: require('../../../../assets/icons/services/love-forecast/icon-1.png'),
      label: t('loveForecast.cards.intro')
    },
    {
      icon: require('../../../../assets/icons/services/love-forecast/icon-2.png'),
      label: t('loveForecast.cards.lacking')
    },
    {
      icon: require('../../../../assets/icons/services/love-forecast/icon-3.png'),
      label: t('loveForecast.cards.lookout')
    },
    {
      icon: require('../../../../assets/icons/services/love-forecast/icon-4.png'),
      label: t('loveForecast.cards.suits')
    },
    {
      icon: require('../../../../assets/icons/services/love-forecast/icon-5.png'),
      label: t('loveForecast.cards.outlook')
    },
    {
      icon: require('../../../../assets/icons/services/love-forecast/icon-6.png'),
      label: t('loveForecast.cards.where')
    },
    {
      icon: require('../../../../assets/icons/services/love-forecast/icon-7.png'),
      label: t('loveForecast.cards.questions')
    },
    {
      icon: require('../../../../assets/icons/services/love-forecast/icon-8.png'),
      label: t('loveForecast.cards.conclusion')
    },
  ];
  const [showPurchaseModal, setShowPurchaseModal] = React.useState(false);
  const [showPollingModal, setShowPollingModal] = React.useState(false);
  const [pollingJobId, setPollingJobId] = React.useState<string | null>(null);
  const {
    cost,
    creditType,
    loading: costLoading,
    setLoading: setCostLoading
  } = useServiceCost('love_report');

  const handleContinue = async () => {
    setCostLoading(true);
    try {
      const response = await api.post('/v1/affinity/love-report', {});
      setShowPurchaseModal(false);
      // Expecting response.meta.job_id or response.data.job_id
      console.log(response)
      const jobId = response?.data?.job_id;
      if (jobId) {
        setPollingJobId(jobId);
        setShowPollingModal(true);
      } else {
        Alert.alert(t('loveForecast.error'), t('loveForecast.noJobId'));
      }
    } catch (err) {
      setShowPurchaseModal(false);
    } finally {
      setCostLoading(false);
    }
  };

  const handleCancel = () => {
    setShowPurchaseModal(false);
  };

  const handlePollingResult = (usageHistory: any) => {
    setShowPollingModal(false);
    setPollingJobId(null);
    navigation.navigate('LoveReportResult', {
      result: JSON.parse(usageHistory.response_data)
    });
  };

  const handlePollingError = (error: any) => {
    setShowPollingModal(false);
    setPollingJobId(null);
    Alert.alert(t('loveForecast.error'), t('loveForecast.fetchStatusFailed'));
  };

  return (
    <ScreenContainer
      header={
        <Header
          title={t('loveForecast.header')}
          onBack={() => navigation.goBack()}
        />
      }
      floatingFooter={
        <AppButton
          title={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText color='white' style={{ marginRight: 4 }}>{t('loveForecast.purchase', { cost })}</AppText>
              <CoinIcon color={creditType === 'gold' ? '#E0AE1E' : '#EB4335'} size={18} />
            </View>
          }
          variant="primary"
          onPress={() => setShowPurchaseModal(true)}
        />
      }
    >
      <AppText variant='subtitle1' style={styles.title}>{t('loveForecast.title')}</AppText>
      <ShinyContainer dark={false} size={220} style={{ marginVertical: 20 }}>
        <Image source={require('../../../../assets/icons/services/love-forecast/service-icon.png')} />
      </ShinyContainer>
      <AppText style={styles.subtitle} variant='title4' color='primary'>
        {t('loveForecast.subtitle')}
      </AppText>
      <AppText style={styles.description} color='neutral'>
        {t('loveForecast.description')}
      </AppText>
      <AppText style={styles.sectionTitle} variant='subtitle1' color='primary'>{t('loveForecast.sectionTitle')}</AppText>

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
        loading={costLoading}
      />
      {pollingJobId && (
        <PollingLoadingModal
          job_id={pollingJobId}
          visible={showPollingModal}
          message={t('loveForecast.pollingMessage')}
          onResult={handlePollingResult}
          onError={handlePollingError}
          onClose={() => {
            setShowPollingModal(false);
            setPollingJobId(null);
          }}
        />
      )}
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
