import React, { useEffect, useRef } from 'react';
import { Modal, View, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from './app-text';
import api from '../../utils/http';
import { COLORS } from '../../constants/colors';
import { scaleSize, scaleFont } from '../../utils/scale';
import { useTranslation } from 'react-i18next';

type PollingLoadingModalProps = {
  topupNo: string;
  visible: boolean;
  message?: string;
  onResult: (data: any) => void;
  onError?: (error: any) => void;
  onClose: () => void;
  pollIntervalMs?: number;
};

const PollingLoadingModal: React.FC<PollingLoadingModalProps> = ({
  topupNo,
  visible,
  message = 'Please wait...',
  onResult,
  onError,
  onClose,
  pollIntervalMs = 2500,
}) => {
  const intervalRef = useRef<number | null>(null);
  const isActive = useRef(false);

  useEffect(() => {
    if (visible && topupNo) {
      isActive.current = true;
      const poll = async () => {
        try {
          const response = await api.get(`/v1/usage-histories/${topupNo}`);
          console.log('polling', topupNo, response)
          // Check if usage history exists and is ready (customize as needed)
          if (response && response.data.response_data) {
            isActive.current = false;
            clearInterval(intervalRef.current!);
            onResult(response.data);
          }
        } catch (error) {
          if (onError) {
            isActive.current = false;
            clearInterval(intervalRef.current!);
            onError(error);
          }
        }
      };
      poll(); // initial call
      intervalRef.current = setInterval(poll, pollIntervalMs);
    }
    return () => {
      isActive.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, topupNo, pollIntervalMs, onResult, onError]);

  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={COLORS.neutral} />
          <AppText variant="body1" style={styles.text} color='neutral'>{message}</AppText>
          <AppText variant="caption1" style={styles.info} color='neutral'>
            {t('polling.info')}
          </AppText>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <AppText variant="body1" style={styles.closeButtonText} color='black'>{t('polling.closeBtn')}</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#3F3F3F80',
    borderWidth: scaleSize(1),
    borderColor: COLORS.neutral,
    padding: scaleSize(24),
    borderRadius: scaleSize(12),
    alignItems: 'center',
    maxWidth: scaleSize(350),
  },
  text: {
    marginTop: scaleSize(16),
    textAlign: 'center',
  },
  info: {
    marginTop: scaleSize(12),
    textAlign: 'center',
  },
  closeButton: {
    marginTop: scaleSize(24),
    backgroundColor: '#eee',
    paddingHorizontal: scaleSize(24),
    paddingVertical: scaleSize(10),
    borderRadius: scaleSize(8),
  },
  closeButtonText: {
    fontWeight: 'bold',
  },
});

export default PollingLoadingModal;
