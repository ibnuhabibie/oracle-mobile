import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { AppText } from './app-text';
import { AppButton } from './app-button';
import { COLORS } from '../../constants/colors';
import { useAsyncStorage } from '../../hooks/use-storage';
import CoinIcon from '../icons/profile/coin-icon';
import { useNavigation } from '@react-navigation/native';

interface PurchaseAlertModalProps {
  visible: boolean;
  onContinue: () => void;
  onCancel: () => void;
  service: string;
}

const PurchaseAlertModal: React.FC<PurchaseAlertModalProps> = ({
  visible,
  onContinue,
  onCancel,
  service,
}) => {
  const { sync } = useAsyncStorage();
  const [loading, setLoading] = useState<boolean>(false);
  const [userCredit, setUserCredit] = useState<number>(0);
  const [isSufficient, setIsSufficient] = useState<boolean>(false);
  const [creditType, setCreditType] = useState<string>('');
  const [cost, setCost] = useState<number>(0);

  const navigation = useNavigation()

  useEffect(() => {
    const syncAndLoad = async () => {
      try {
        setLoading(true);
        const data = await sync();

        let key = service;
        let creditType = 'silver';
        let cost = getConfigValue(`${key}_cost_using_silver_credit`, data.config);

        if (cost <= 0) {
          cost = getConfigValue(`${key}_cost_using_gold_credit`, data.config);
          creditType = 'gold';
        }

        let userCredit = creditType === 'silver' ? data.user?.silver_credits : data.user?.gold_credits;
        setUserCredit(userCredit)
        const isSufficient = userCredit >= cost;
        setIsSufficient(isSufficient)

        setCost(cost)
        setCreditType(creditType)

        setLoading(false);
      } catch (error) {
        console.log(error)
        setLoading(false);
      }
    };

    if (visible) syncAndLoad();
  }, [visible]);

  const getConfigValue = (key: string, config) => {
    const found = config.find((c: any) => c.key === key);
    return found ? Number(found.value) : 0;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <AppText variant="subtitle1" color="primary" style={styles.title}>
            PURCHASE ALERT
          </AppText>
          {isSufficient ? (
            <>
              <AppText style={{ textAlign: 'center', lineHeight: 22 }}>
                To ask the Geenie, it will cost {cost} <CoinIcon size={19} color={creditType === 'silver' ? "#EB4335" : "#E0AE1E"} />
                {'\n'}Continue?
              </AppText>
              <AppText style={{ textAlign: 'center', marginTop: 14 }} color="neutral">
                Your {creditType === 'gold' ? 'Gold' : 'Silver'} Credits: {userCredit} <CoinIcon size={19} color={creditType === 'silver' ? "#EB4335" : "#E0AE1E"} />
              </AppText>
              <View style={styles.buttonGroup}>
                <AppButton
                  title="Continue to Purchase"
                  variant="secondary"
                  onPress={onContinue}
                  loading={loading}
                />
                <AppButton title="Cancel" variant="outline" onPress={onCancel} />
              </View>
            </>
          ) : (
            <>
              <AppText style={{ textAlign: 'center', lineHeight: 22 }}>
                This report will cost {cost}
                {'\n'}Your current {creditType} credits are insufficient. Please top up to proceed.
              </AppText>
              <AppText style={{ textAlign: 'center', marginTop: 14 }} color="neutral">
                Your {creditType === 'gold' ? 'Gold' : 'Silver'} Credits: {userCredit}
              </AppText>
              <View style={styles.buttonGroup}>
                <AppButton
                  title="Purchase Credits"
                  variant="secondary"
                  onPress={() => navigation.navigate('TopUp')}
                  loading={loading}
                />
                <AppButton title="Cancel" variant="outline" onPress={onCancel} />
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
