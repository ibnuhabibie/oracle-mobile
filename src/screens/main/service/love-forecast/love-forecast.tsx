import React from 'react';
import { InteractionManager } from "react-native";
import {
  View,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
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
import LoveReportIcon from '../../../../components/icons/services/love-report/love-report-icon';
import LoveReportIcon1 from '../../../../components/icons/services/love-report/love-report-icon-1';
import LoveReportIcon2 from '../../../../components/icons/services/love-report/love-report-icon-2';
import LoveReportIcon3 from '../../../../components/icons/services/love-report/love-report-icon-3';
import LoveReportIcon4 from '../../../../components/icons/services/love-report/love-report-icon-4';
import LoveReportIcon5 from '../../../../components/icons/services/love-report/love-report-icon-5';
import LoveReportIcon6 from '../../../../components/icons/services/love-report/love-report-icon-6';
import LoveReportIcon7 from '../../../../components/icons/services/love-report/love-report-icon-7';
import LoveReportIcon8 from '../../../../components/icons/services/love-report/love-report-icon-8';
import { scaleSize, scaleFont } from '../../../../utils/scale';

type LoveForecastProps = NativeStackScreenProps<MainNavigatorParamList, 'LoveForecast'>;

/* CARD_DATA is now created inside the component */

const LoveForecast: React.FC<LoveForecastProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [iconsReady, setIconsReady] = React.useState(false);

  React.useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      setIconsReady(true);
    });
    return () => interaction && interaction.cancel && interaction.cancel();
  }, []);

  const CARD_DATA = [
    {
      icon: LoveReportIcon1,
      label: t('loveForecast.cards.intro')
    },
    {
      icon: LoveReportIcon2,
      label: t('loveForecast.cards.lacking')
    },
    {
      icon: LoveReportIcon3,
      label: t('loveForecast.cards.lookout')
    },
    {
      icon: LoveReportIcon4,
      label: t('loveForecast.cards.suits')
    },
    {
      icon: LoveReportIcon5,
      label: t('loveForecast.cards.outlook')
    },
    {
      icon: LoveReportIcon6,
      label: t('loveForecast.cards.where')
    },
    {
      icon: LoveReportIcon7,
      label: t('loveForecast.cards.questions')
    },
    {
      icon: LoveReportIcon8,
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
    navigation.navigate('LoveReportResult', {
      result: JSON.parse(usageHistory.response_data),
      job_id: pollingJobId ?? ''
    });
    setPollingJobId(null);
  };

  const handlePollingError = (error: any) => {
    setShowPollingModal(false);
    setPollingJobId(null);
    Alert.alert(t('loveForecast.error'), t('loveForecast.fetchStatusFailed'));
  };

  const shinySize = scaleSize(140);
  const iconSize = scaleSize(44);
  const gridGap = scaleSize(12);

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
            <View style={styles.buttonRow}>
              <AppText color='white' style={{ marginRight: 4 }}>{t('loveForecast.purchase', { cost })}</AppText>
              <CoinIcon type={creditType === 'gold' ? 'gold' : 'silver'} size={scaleSize(18)} />
            </View>
          }
          variant="primary"
          onPress={() => setShowPurchaseModal(true)}
        />
      }
    >
      <AppText variant='subtitle1' style={styles.title} color='white'>{t('loveForecast.title')}</AppText>
      <ShinyContainer size={scaleSize(220)} style={{ marginVertical: scaleSize(20) }}>
        <LoveReportIcon size={scaleSize(60)} />
      </ShinyContainer>
      <AppText style={styles.subtitle} variant='title4' color='primary'>
        {t('loveForecast.subtitle')}
      </AppText>
      <AppText style={styles.description} color='neutral'>
        {t('loveForecast.description')}
      </AppText>
      <AppText style={styles.sectionTitle} variant='subtitle1' color='primary'>{t('loveForecast.sectionTitle')}</AppText>

      {iconsReady ? (
        <View style={[styles.grid]}>
          {
            CARD_DATA.map((card, idx) => (
              <View key={idx} style={styles.card}>
                <View style={styles.cardIconWrapper}>
                  <ShinyContainer size={scaleSize(shinySize)}>
                    {React.createElement(card.icon, { size: scaleSize(iconSize), color: 'white' })}
                  </ShinyContainer>
                </View>
                <AppText style={styles.cardLabel} color='white'>{card.label}</AppText>
              </View>
            ))
          }
        </View>
      ) : (
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
      <View style={styles.spacer} />
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
  activityIndicatorWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: scaleSize(120),
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: scaleSize(18),
    letterSpacing: scaleSize(0.2),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: scaleSize(8),
    marginTop: scaleSize(8),
  },
  description: {
    textAlign: 'center',
    marginVertical: scaleSize(22),
    lineHeight: scaleSize(18),
  },
  sectionTitle: {
    textAlign: 'center',
    marginVertical: scaleSize(32),
    letterSpacing: scaleSize(0.2),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-between"
    // gap is set dynamically
  },
  card: {
    padding: scaleSize(12),
    borderRadius: scaleSize(12),
    borderWidth: scaleSize(1),
    borderColor: COLORS.black,
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: '4%'
  },
  cardIconWrapper: {
    marginBottom: scaleSize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    marginTop: scaleSize(12)
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    height: scaleSize(80),
  },
});

export default LoveForecast;
