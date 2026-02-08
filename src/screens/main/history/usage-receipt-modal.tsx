import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { AppText } from '../../../components/ui/app-text';
import CoinIcon from "../../../components/icons/profile/coin-icon";
import { AppButton } from "../../../components/ui/app-button";
import PollingLoadingModal from "../../../components/ui/polling-loading-modal";
import CommentsIcon from "../../../components/icons/profile/comments-icon";
import CloseIcon from "../../../components/icons/close-icon";

import { COLORS } from "../../../constants/colors";
import { serviceTypeTranslationKeys } from "../../../constants/app";

import { scaleFont, scaleSize } from "../../../utils/scale";
import { formatDateWithTime } from "../../../utils/date";
import { formatPrice } from "../../../utils/formatter";

import type { UsageReceiptModalProps } from './types';

const UsageReceiptModal: React.FC<UsageReceiptModalProps> = ({ visible, onClose, item }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (visible) {
      setReady(false);

      const id = requestAnimationFrame(() => {
        setReady(true);
      });

      return () => cancelAnimationFrame(id);
    } else {
      setReady(false);
    }
  }, [visible]);

  const getServiceTypeLabel = (type: string) =>
    t(serviceTypeTranslationKeys[type] || type);

  const handleResult = (response_data = null) => {
    if (!item) return;
    const response = typeof response_data == 'string' ? response_data : item.response_data;
    console.log(response)
    let data = JSON.parse(response)
    let payload: any = {}
    let pageName = ''

    if (item.service_type == 'personalized_love_forecast_12mth') {
      pageName = 'LoveReportResult'
      payload = {
        result: data,
        job_id: item.job_id
      }
    } else if (item.service_type == 'ask_any_question') {
      pageName = 'AffinityResults'
      payload = {
        question: data.question,
        affinityResult: { data }
      }
    } else if (item.service_type == 'transit_report') {
      pageName = 'FortuneReportResult'
      payload = {
        result: data,
        job_id: item.job_id
      }
    } else if (item.service_type == 'relationship_compatibility') {
      pageName = 'RelationReportResult'
      payload = {
        result: data,
        love_profile: item.request_data ? JSON.parse(item.request_data).partner : undefined,
        job_id: item.job_id
      }
    } else if (item.service_type == 'ask_secret_diary') {
      console.log(data, new Date(data.date))
      pageName = 'EchoDetail'
      payload = {
        id: data.id,
        date: {
          dateString: data.date
        }
      }
    }

    navigation.navigate(pageName as any, payload)
  }

  const NoData = () => {
    return (
      <View style={{ marginVertical: 32 }}>
        <AppText variant="body1" style={styles.centerText} color="gray">
          {t("usageReceiptModal.noData")}
        </AppText>
      </View>
    )
  }

  const CreditJournal = ({ item }: { item: any }) => {
    return (
      <>
        <View style={styles.modalSectionDivider} />
        <AppText variant="body1" style={styles.modalSectionTitle} color="neutral">{t("usageReceiptModal.orderItems")}</AppText>
        <View style={styles.modalRow}>
          <View style={styles.modalItemIcon}>
            <CommentsIcon color={COLORS.primary} />
          </View>
          <AppText variant="body1" style={styles.modalItemName} color="neutral">{getServiceTypeLabel(item.service_type)}</AppText>
          <View style={styles.modalItemPoints}>
            <AppText color="white" variant='caption2'>{item.credit_journal.credits_used}</AppText>
            <CoinIcon size={scaleSize(12, 10, 16)} type={item.credit_journal.credit_type == 'silver' ? 'silver' : 'gold'} />
          </View>
        </View>
        <View style={styles.modalSectionDivider} />
        <View style={styles.modalRow}>
          <AppText variant="caption1" style={styles.modalLabel} color="neutral">{t("usageReceiptModal.previousPoints")}</AppText>
          <View style={styles.modalItemPoints}>
            <AppText color="white" variant='caption2'>{item.credit_journal.credits_before}</AppText>
            <CoinIcon size={scaleSize(12, 10, 16)} type={item.credit_journal.credit_type == 'silver' ? 'silver' : 'gold'} />
          </View>
        </View>
        <View style={styles.modalRow}>
          <AppText variant="caption1" style={styles.modalLabel} color="neutral">{t("usageReceiptModal.pointsUsed")}</AppText>
          <View style={styles.modalItemPoints}>
            <AppText variant="caption1" color="red">{item.credit_journal.credits_used}</AppText>
            <CoinIcon size={scaleSize(12, 10, 16)} type={item.credit_journal.credit_type == 'silver' ? 'silver' : 'gold'} />
          </View>
        </View>
        <View style={styles.modalRow}>
          <AppText variant="caption1" style={styles.modalLabel} color="neutral">{t("usageReceiptModal.remainingPoints")}</AppText>
          <View style={styles.modalItemPoints}>
            <AppText color="green" variant='caption2'>{item.credit_journal.credits_after}</AppText>
            <CoinIcon size={scaleSize(12, 10, 16)} type={item.credit_journal.credit_type == 'silver' ? 'silver' : 'gold'} />
          </View>
        </View>
        {
          item.response_data && (
            <AppButton title={t("usageReceiptModal.seeResults")} style={{ marginTop: scaleSize(12, 12, 18) }} onPress={() => handleResult()} />
          )
        }
      </>
    )
  }

  const DirectDetail = ({ item }: { item: any }) => {
    return (
      <>
        <View style={styles.modalSectionDivider} />
        <AppText variant="body1" style={styles.modalSectionTitle} color="neutral">{t("usageReceiptModal.orderItems")}</AppText>
        <View style={styles.modalRow}>
          <View style={styles.modalItemIcon}>
            <CommentsIcon color={COLORS.primary} />
          </View>
          <AppText variant="body1" style={styles.modalItemName} color="neutral">{getServiceTypeLabel(item.service_type)}</AppText>
          <View style={styles.modalItemPoints}>
            <AppText color="white" variant='caption2'>{formatPrice(item.amount, item.currency_symbol)}</AppText>
          </View>
        </View>
        <View style={styles.modalSectionDivider} />
        {/* <View style={styles.modalRow}>
          <AppText variant="caption1" color="neutral">{t("topupReceiptModal.paymentMethod")}</AppText>
          <AppText variant="caption1" color="white">{JSON.parse(item.payment_method).method}</AppText>
        </View>
        <View style={styles.modalSectionDivider} /> */}
        <AppButton title={t("usageReceiptModal.seeResults")} style={{ marginTop: scaleSize(12, 12, 18) }} onPress={() => handleResult()} />
      </>
    )
  }

  const PaymentStatus = ({ item }: { item: any }) => {
    const infoText = item.payment_status == 'pending' ? t("usageHistory.paymentPending") : 'Payment is completed but report is still on process generating. We will let you know when its ready';
    return (
      <View style={{ marginVertical: scaleSize(12, 12, 16) }}>
        <AppText variant="body1" style={styles.centerText} color="gray">
          {infoText}
        </AppText>
        {
          item.payment_status == 'pending' ?
            <AppButton
              style={{ marginTop: 12, alignSelf: "center" }}
              onPress={() => { }}
              title={t("topupReceiptModal.continuePayment")}
            /> : null
        }
      </View >
    )
  }

  const DetailReceipt = ({ item }: { item: any }) => {
    if (item.payment_type == 'credit') return <CreditJournal item={item} />


    if (!item.response_data) return <PaymentStatus item={item} />
    else return <DirectDetail item={item} />
  }

  const DetailItem = () => {
    if (!item) return null;
    return (
      <>
        <View style={styles.modalRow}>
          <AppText variant="caption1" style={styles.modalLabel} color="neutral">{t("usageReceiptModal.datePurchased")}</AppText>
          <AppText variant="caption1" style={styles.modalValue} color="white">{formatDateWithTime(item.created_at)}</AppText>
        </View>
        <DetailReceipt item={item} />
      </>
    )
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      hardwareAccelerated
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <AppText variant="subtitle2" style={styles.modalTitle} color="primary">{t("usageReceiptModal.receipt")}</AppText>
                <TouchableOpacity onPress={onClose}>
                  <CloseIcon size={scaleSize(22)} />
                </TouchableOpacity>
              </View>
              {
                !ready ?
                  (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" />
                    </View>
                  )
                  :
                  !item ?
                    (
                      <NoData />
                    )
                    :
                    (
                      <DetailItem />
                    )
              }
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback >
    </Modal >
  );
};

const styles = StyleSheet.create({
  loadingContainer: {

  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.8)',
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: '#3F3F3F80',
    borderWidth: scaleSize(1),
    borderColor: COLORS.neutral,
    borderRadius: scaleSize(12, 12, 16),
    padding: scaleSize(14, 14, 20),
    width: "90%",
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scaleSize(8, 8, 12),
  },
  modalTitle: {
    letterSpacing: scaleSize(1),
    flex: 1,
    textAlign: "center",
    fontSize: scaleFont(16, 12, 20),
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: scaleSize(2, 2, 4),
  },
  modalLabel: {
    flex: 1,
    fontSize: scaleFont(12, 10, 16),
  },
  modalValue: {
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
    fontSize: scaleFont(12, 10, 16),
  },
  modalSectionDivider: {
    height: scaleSize(1),
    backgroundColor: "#F0F0F0",
    marginVertical: scaleSize(6, 6, 10),
  },
  modalSectionTitle: {
    fontWeight: "bold",
    marginBottom: scaleSize(4, 4, 6),
    fontSize: scaleFont(14, 12, 18),
  },
  modalItemIcon: {
    marginRight: scaleSize(6, 6, 8),
    padding: scaleSize(6, 6, 8),
    borderRadius: scaleSize(6, 6, 8),
    backgroundColor: '#FFFFFF22'
  },
  modalItemName: {
    flex: 1,
    fontSize: scaleFont(12, 10, 16),
  },
  modalItemPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(2, 2, 4)
  },
  centerText: {
    textAlign: "center",
    fontSize: scaleFont(12, 10, 16),
  },
});

export default UsageReceiptModal;
