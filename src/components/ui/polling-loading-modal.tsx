import React, { useEffect, useRef } from 'react';
import { Modal, View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import api from '../../utils/http';

type PollingLoadingModalProps = {
  job_id: string;
  visible: boolean;
  message?: string;
  onResult: (data: any) => void;
  onError?: (error: any) => void;
  onClose: () => void;
  pollIntervalMs?: number;
};

const PollingLoadingModal: React.FC<PollingLoadingModalProps> = ({
  job_id,
  visible,
  message = 'Please wait...',
  onResult,
  onError,
  onClose,
  pollIntervalMs = 1000,
}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActive = useRef(false);

  useEffect(() => {
    if (visible && job_id) {
      isActive.current = true;
      const poll = async () => {
        try {
          const response = await api.get(`/v1/usage-histories/${job_id}`);
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
  }, [visible, job_id, pollIntervalMs, onResult, onError]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.text}>{message}</Text>
          <Text style={styles.info}>
            You can close this modal and just wait, our system will notify you when the report is ready.
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: 350,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  info: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 24,
    backgroundColor: '#eee',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default PollingLoadingModal;
