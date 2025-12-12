import { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native';
import api from '../utils/http';

export interface PaymentOptions {
  reportType: string;
  locale?: string;
  additionalData?: Record<string, any>;
}

export interface UseDirectPaymentReturn {
  isProcessing: boolean;
  showPolling: boolean;
  topupNo: string;
  setShowPolling: (value: boolean) => void;
  setIsProcessing: (value: boolean) => void;
  processPayment: (options: PaymentOptions) => Promise<void>;
  openPaymentSheet: (clientSecret: string) => Promise<void>;
}

// Payment types
export const PAYMENT_TYPES = {
  LOVE_REPORT: 'love_report',
  RELATIONSHIP_REPORT: 'relationship_report',
  TRANSIT_REPORT: 'transit_report',
  ASK_AFFINITY: 'ask_affinity',
  SECRET_DIARY: 'secret_diary',
} as const;

// Payment status types
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
} as const;

// Payment method types
export const PAYMENT_METHODS = {
  CREDIT: 'credit',
  DIRECT: 'direct',
} as const;

interface PaymentError {
  code?: string;
  message?: string;
  localizedMessage?: string;
}

/**
 * Handle payment errors and show appropriate alerts
 */
function handlePaymentError(error: PaymentError, t: any): void {
  console.log('Payment error:', error);

  let errorMessage = t('directPayment.paymentFailedMessage');

  if (error.code === 'Canceled') {
    errorMessage = t('directPayment.paymentNotCompletedMessage');
  } else if (error.localizedMessage) {
    errorMessage = error.localizedMessage;
  } else if (error.message) {
    errorMessage = error.message;
  }

  Alert.alert(t('directPayment.paymentErrorTitle'), errorMessage);
}

/**
 * Show payment success alert
 */
function showPaymentSuccessAlert(t: any): void {
  Alert.alert(
    t('directPayment.paymentSuccessTitle'),
    t('directPayment.paymentSuccessMessage'),
    [{ text: t('topup.ok') }]
  );
}

/**
 * Build payment payload with common parameters
 */
function buildPaymentPayload(
  reportType: string,
  locale: string,
  additionalData: Record<string, any> = {}
): Record<string, any> {
  const payload: Record<string, any> = {
    reportType,
    locale,
  };

  // Add additional data if provided
  Object.assign(payload, additionalData);

  return payload;
}

export function useDirectPayment(): UseDirectPaymentReturn {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPolling, setShowPolling] = useState(false);
  const [topupNo, setTopupNo] = useState('');

  const openPaymentSheet = async (clientSecret: string) => {
    const { error: errorInit } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Affinity AI',
    });

    if (errorInit) {
      handlePaymentError(errorInit, t);
      return;
    }

    const { error } = await presentPaymentSheet();

    if (error) {
      handlePaymentError(error, t);
    } else {
      // showPaymentSuccessAlert(t);
      setShowPolling(true)
    }
  };

  const processPayment = async (options: PaymentOptions) => {
    setIsProcessing(true);

    try {
      const payload = buildPaymentPayload(
        options.reportType,
        options.locale || '',
        options.additionalData
      );

      const response = await api.post('/v1/payments/direct', payload);
      console.log(response, 'response direct-payment');

      setTopupNo(response.data.trx_no)

      await openPaymentSheet(response.data.client_secret);
    } catch (err) {
      console.log(err);
      handlePaymentError({ message: 'Payment failed' }, t);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    setIsProcessing,
    showPolling,
    setShowPolling,
    topupNo,
    processPayment,
    openPaymentSheet,
  };
}