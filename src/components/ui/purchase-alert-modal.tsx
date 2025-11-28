import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { AppText } from './app-text';
import { AppButton } from './app-button';
import { COLORS } from '../../constants/colors';
import { useAsyncStorage } from '../../hooks/use-storage';
import CoinIcon from '../icons/profile/coin-icon';
import { useNavigation } from '@react-navigation/native';
import { serviceTypeTranslationKeys } from '../../constants/app';
import { useTranslation, Trans } from 'react-i18next';
import { scaleSize } from '../../utils/scale';
import { useServiceCost } from '../../hooks/use-service-cost';

interface PurchaseAlertModalProps {
  visible: boolean;
  onContinue: () => void;
  onCancel: () => void;
  service: string;
  loading?: boolean;
}

const PurchaseAlertModal: React.FC<PurchaseAlertModalProps> = ({
  visible,
  onContinue,
  onCancel,
  service,
  loading,
}) => {
  const { t } = useTranslation();
  const { sync } = useAsyncStorage();
  const [userCredit, setUserCredit] = useState<number>(0);
  const [isSufficient, setIsSufficient] = useState<boolean>();

  const {
    cost,
    creditType,
    loading: internalLoading,
    setLoading: setInternalLoading,
  } = useServiceCost(service);

  // Use external loading if provided, else internal
  const effectiveLoading = loading !== undefined ? loading : internalLoading;

  const navigation = useNavigation();

  useEffect(() => {
    const syncAndLoad = async () => {
      try {
        setInternalLoading(true);
        const data = await sync();

        if (!data || !data.config || !data.user) {
          setInternalLoading(false);
          return;
        }

        let userCredit = creditType === 'silver' ? data.user?.silver_credits : data.user?.gold_credits;
        setUserCredit(userCredit ?? 0);
        const isSufficient = (userCredit ?? 0) >= cost;
        setIsSufficient(isSufficient);

        setInternalLoading(false);
      } catch (error) {
        console.log(error);
        setInternalLoading(false);
      }
    };

    if (visible) syncAndLoad();
  }, [visible]);

  const getConfigValue = (key: string, config: any[]): number => {
    const found = config.find((c: any) => c.key === key);
    return found ? Number(found.value) : 0;
  };

  const getServiceTypeLabel = (type: string) =>
    t(serviceTypeTranslationKeys[type] || type);

  const PurchaseAlertCreditText: React.FC<{
    creditType: string;
    userCredit: number;
  }> = ({ creditType, userCredit }) => (
    <View style={[styles.textCoinWrapper, styles.creditTextMargin]}>
      <AppText style={styles.centerText} color='neutral'>
        <Trans
          i18nKey="purchaseAlert.yourCredits"
          values={{
            creditType: creditType === 'gold' ? t('Gold') : t('Silver'),
            userCredit
          }}
        />
      </AppText>
      <CoinIcon size={scaleSize(19)} type={creditType === 'silver' ? 'silver' : 'gold'} />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <AppText variant="subtitle1" color="primary" style={styles.title}>
                {t('purchaseAlert.title')}
              </AppText>
              {
                isSufficient ?
                  (
                    <>
                      <View style={styles.textCoinWrapper}>
                        <AppText variant='caption1' style={styles.costInfoText} color='white'>
                          <Trans
                            i18nKey="purchaseAlert.costInfo"
                            values={{ cost, service: getServiceTypeLabel(service) }}
                          />
                        </AppText>
                        {/* <CoinIcon size={scaleSize(19)} type={creditType === 'silver' ? 'silver' : 'gold'} /> */}
                      </View>
                      <PurchaseAlertCreditText
                        creditType={creditType}
                        userCredit={userCredit}
                      />
                      <View style={styles.buttonGroup}>
                        <AppButton
                          title={t('purchaseAlert.continue')}
                          variant="primary"
                          onPress={onContinue}
                          loading={effectiveLoading}
                        />
                        <AppButton title={t('purchaseAlert.cancel')} variant="outline" onPress={onCancel} />
                      </View>
                    </>
                  ) :
                  (
                    <>
                      <AppText style={styles.insufficientText} color='neutral'>
                        <Trans
                          i18nKey="purchaseAlert.insufficient"
                          values={{
                            cost,
                            creditType: creditType === 'gold' ? t('Gold') : t('Silver')
                          }}
                        />
                      </AppText>
                      <PurchaseAlertCreditText
                        creditType={creditType}
                        userCredit={userCredit}
                      />
                      <View style={styles.buttonGroup}>
                        <AppButton
                          title={t('purchaseAlert.purchaseCredits')}
                          variant="secondary"
                          onPress={() => navigation.navigate('TopUp')}
                          loading={effectiveLoading}
                        />
                        <AppButton title={t('purchaseAlert.cancel')} variant="outline" onPress={onCancel} />
                      </View>
                    </>
                  )
              }
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textCoinWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scaleSize(3),
  },
  creditTextMargin: {
    marginTop: scaleSize(14),
  },
  centerText: {
    textAlign: 'center',
  },
  costInfoText: {
    textAlign: 'center',
    lineHeight: scaleSize(22),
  },
  insufficientText: {
    textAlign: 'center',
    lineHeight: scaleSize(22),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#3F3F3F80',
    borderWidth: 1,
    borderColor: COLORS.neutral,
    borderRadius: scaleSize(16),
    padding: scaleSize(24),
    width: scaleSize(320),
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: scaleSize(16),
    shadowOffset: { width: 0, height: scaleSize(4) },
  },
  title: {
    marginBottom: scaleSize(12),
    textAlign: 'center',
    letterSpacing: scaleSize(0.2),
  },
  buttonGroup: {
    marginTop: scaleSize(18),
    width: '100%',
    gap: scaleSize(12),
  },
});

export default PurchaseAlertModal;
