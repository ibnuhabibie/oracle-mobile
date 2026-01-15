import React, { useEffect, useState } from 'react';
import { InteractionManager } from "react-native";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as RNLocalize from "react-native-localize";

import { AppText } from '../../../../components/ui/app-text';
import { COLORS } from '../../../../constants/colors';
import { MainNavigatorParamList } from '../../../../navigators/types';
import { AppButton } from '../../../../components/ui/app-button';
import ShinyContainer from '../../../../components/widgets/shiny-container';
import ScreenContainer from '../../../../components/layouts/screen-container';
import Header from '../../../../components/ui/header';
import { useServiceCost } from '../../../../hooks/use-service-cost';
import { useDirectPayment } from '../../../../hooks/use-direct-payment';
import LoveReportIcon from '../../../../components/icons/services/love-report/love-report-icon';
import LoveReportIcon1 from '../../../../components/icons/services/love-report/love-report-icon-1';
import LoveReportIcon2 from '../../../../components/icons/services/love-report/love-report-icon-2';
import LoveReportIcon3 from '../../../../components/icons/services/love-report/love-report-icon-3';
import LoveReportIcon4 from '../../../../components/icons/services/love-report/love-report-icon-4';
import LoveReportIcon5 from '../../../../components/icons/services/love-report/love-report-icon-5';
import LoveReportIcon6 from '../../../../components/icons/services/love-report/love-report-icon-6';
import LoveReportIcon7 from '../../../../components/icons/services/love-report/love-report-icon-7';
import LoveReportIcon8 from '../../../../components/icons/services/love-report/love-report-icon-8';
import { scaleSize } from '../../../../utils/scale';
import { formatPrice } from '../../../../utils/formatter';
import PollingLoadingModal from '../../../../components/ui/polling-loading-modal';

type LoveForecastProps = NativeStackScreenProps<MainNavigatorParamList, 'LoveForecast'>;

/* CARD_DATA is now created inside the component */

const LoveForecast: React.FC<LoveForecastProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [iconsReady, setIconsReady] = useState(false);

  const {
    cost,
    loading: costLoading,
    setLoading: setCostLoading,
    locale,
    currencySymbol
  } = useServiceCost('love_report');

  const {
    isProcessing,
    processPayment,
    showPolling,
    setShowPolling,
    topupNo
  } = useDirectPayment();

  const shinySize = scaleSize(140);
  const iconSize = scaleSize(44);

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

  useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      setIconsReady(true);
    });
    return () => interaction && interaction.cancel && interaction.cancel();
  }, []);

  const directPayment = async () => {
    setCostLoading(true);
    try {
      await processPayment({
        reportType: "love_report",
        locale: locale,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setCostLoading(false);
    }
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
            <View style={styles.buttonRow}>
              <AppText color='white' style={{ marginRight: 4 }}>
                {t('loveForecast.purchase', { cost: formatPrice(cost, currencySymbol) })}
              </AppText>
            </View>
          }
          variant="primary"
          onPress={directPayment}
          loading={costLoading || isProcessing}
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
      <PollingLoadingModal
        topupNo={topupNo}
        visible={showPolling}
        onResult={(data) => {
          console.log('data onresult', data)
          setShowPolling(false)
          navigation.navigate('LoveReportResult', {
            result: JSON.parse(data.response_data),
            job_id: data.job_id
          })
        }}
        onClose={() => {
          setShowPolling(false)
        }} />
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
