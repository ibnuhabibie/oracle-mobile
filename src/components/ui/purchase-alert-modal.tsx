import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { AppText } from './app-text';
import { AppButton } from './app-button';
import { COLORS } from '../../constants/colors';
import { useAsyncStorage } from '../../hooks/use-storage';
import CoinIcon from '../icons/profile/coin-icon';
import { useNavigation } from '@react-navigation/native';
import { useTranslation, Trans } from 'react-i18next';

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
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [userCredit, setUserCredit] = useState<number>(0);
  const [isSufficient, setIsSufficient] = useState<boolean>(false);
  const [creditType, setCreditType] = useState<string>('');
  const [cost, setCost] = useState<number>(0);

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

        let key = service;
        let creditType = 'silver';
        let cost = getConfigValue(`${key}_cost_using_silver_credit`, data.config);

        if (cost <= 0) {
          cost = getConfigValue(`${key}_cost_using_gold_credit`, data.config);
          creditType = 'gold';
        }

        let userCredit = creditType === 'silver' ? data.user?.silver_credits : data.user?.gold_credits;
        setUserCredit(userCredit ?? 0);
        const isSufficient = (userCredit ?? 0) >= cost;
        setIsSufficient(isSufficient);

        setCost(cost);
        setCreditType(creditType);

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

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <AppText variant="subtitle1" color="primary" style={styles.title}>
            {t('purchaseAlert.title')}
          </AppText>
          {isSufficient ? (
            <>
              <AppText style={{ textAlign: 'center', lineHeight: 22 }}>
                <Trans
                  i18nKey="purchaseAlert.askGeenie"
                  values={{ cost }}
                  components={{
                    coin: <CoinIcon size={19} color={creditType === 'silver' ? "#EB4335" : "#E0AE1E"} />
                  }}
                />
              </AppText>
              <AppText style={{ textAlign: 'center', marginTop: 14 }} color="neutral">
                <Trans
                  i18nKey="purchaseAlert.yourCredits"
                  values={{
                    creditType: creditType === 'gold' ? t('Gold') : t('Silver'),
                    userCredit
                  }}
                  components={{
                    coin: <CoinIcon size={19} color={creditType === 'silver' ? "#EB4335" : "#E0AE1E"} />
                  }}
                />
              </AppText>
              <View style={styles.buttonGroup}>
                <AppButton
                  title={t('purchaseAlert.continue')}
                  variant="secondary"
                  onPress={onContinue}
                  loading={effectiveLoading}
                />
                <AppButton title={t('purchaseAlert.cancel')} variant="outline" onPress={onCancel} />
              </View>
            </>
          ) : (
            <>
              <AppText style={{ textAlign: 'center', lineHeight: 22 }}>
                <Trans
                  i18nKey="purchaseAlert.insufficient"
                  values={{
                    cost,
                    creditType: creditType === 'gold' ? t('Gold') : t('Silver')
                  }}
                />
              </AppText>
              <AppText style={{ textAlign: 'center', marginTop: 14 }} color="neutral">
                <Trans
                  i18nKey="purchaseAlert.yourCredits"
                  values={{
                    creditType: creditType === 'gold' ? t('Gold') : t('Silver'),
                    userCredit
                  }}
                  components={{
                    coin: <CoinIcon size={19} color={creditType === 'silver' ? "#EB4335" : "#E0AE1E"} />
                  }}
                />
              </AppText>
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
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: 320,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  buttonGroup: {
    marginTop: 18,
    width: '100%',
    gap: 12,
  },
});

export default PurchaseAlertModal;
