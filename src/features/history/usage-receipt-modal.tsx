import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CoinIcon from "../../components/icons/profile/coin-icon";
import CommentsIcon from "../../components/icons/profile/comments-icon";
import { COLORS } from "../../constants/colors";
import { AppButton } from "../../components/ui/app-button";
import { useNavigation } from "@react-navigation/native";

interface UsageReceiptModalProps {
  visible: boolean;
  onClose: () => void;
  item: {
    transaction_id: string;
    usage_history_id: string;
    created_at: string;
    item_name: string;
    item_icon?: React.ReactNode;
    points: number;
    previous_points: number;
    points_used: number;
    remaining_points: number;
    service_type: string;
    response_data: string;
    credit_journal?: {
      credits_used: number;
      credits_before: number;
      credits_after: number;
      credit_type: string;
    };
  };
}

const UsageReceiptModal: React.FC<UsageReceiptModalProps> = ({ visible, onClose, item }) => {
  const { t } = useTranslation();
  if (!item) return null;

  // Format date as "1 May 2025, 19:27 PM"
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month} ${year}, ${hour}:${min} ${date.getHours() >= 12 ? "PM" : "AM"}`;
  };

  const serviceTypeLabels: Record<string, string> = {
    ask_any_question: t("usageReceiptModal.serviceType.ask_any_question"),
    personalized_love_forecast_12mth: t("usageReceiptModal.serviceType.personalized_love_forecast_12mth"),
    transit_report: t("usageReceiptModal.serviceType.transit_report"),
    relationship_compatibility: t("usageReceiptModal.serviceType.relationship_compatibility"),
    ask_secret_diary: t("usageReceiptModal.serviceType.ask_secret_diary"),
  };

  const getServiceTypeLabel = (type: string) => serviceTypeLabels[type] || type;

  const navigation = useNavigation()

  const handleResult = () => {
    let data = JSON.parse(item.response_data)
    let payload = {}
    let pageName = ''

    if (item.service_type == 'personalized_love_forecast_12mth') {
      pageName = 'LoveReportResult'
      payload = { result: data }
    } else if (item.service_type == 'ask_any_question') {
      pageName = 'AffinityResults'
      payload = {
        question: data.question,
        affinityResult: { data }
      }
    } else if (item.service_type == 'transit_report') {
      pageName = 'FortuneReportResult'
      payload = { result: data }
    } else if (item.service_type == 'relationship_compatibility') {
      pageName = 'RelationReportResult'
      payload = {
        result: data,
        love_profile: JSON.parse(item.request_data).partner
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

    navigation.push(pageName, payload)
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t("usageReceiptModal.receipt")}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Order Number</Text>
            <Text style={styles.modalValue}>{item.usage_history_id}</Text>
          </View> */}
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>{t("usageReceiptModal.datePurchased")}</Text>
            <Text style={styles.modalValue}>{formatDate(item.created_at)}</Text>
          </View>
          {item.credit_journal ? (
            <>
              <View style={styles.modalSectionDivider} />
              <Text style={styles.modalSectionTitle}>{t("usageReceiptModal.orderItems")}</Text>
              <View style={styles.modalRow}>
                <View style={styles.modalItemIcon}>
                  <CommentsIcon />
                </View>
                <Text style={styles.modalItemName}>{getServiceTypeLabel(item.service_type)}</Text>
                <View style={styles.modalItemPoints}>
                  <Text>{item.credit_journal.credits_used}</Text>
                  <CoinIcon size={16} color={item.credit_journal.credit_type == 'silver' ? '#EB4335' : '#E0AE1E'} />
                </View>
              </View>
              <View style={styles.modalSectionDivider} />
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>{t("usageReceiptModal.previousPoints")}</Text>
                <View style={styles.modalItemPoints}>
                  <Text>{item.credit_journal.credits_before}</Text>
                  <CoinIcon size={16} color={item.credit_journal.credit_type == 'silver' ? '#EB4335' : '#E0AE1E'} />
                </View>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>{t("usageReceiptModal.pointsUsed")}</Text>
                <View style={styles.modalItemPoints}>
                  <Text style={{ color: 'red' }}>{item.credit_journal.credits_used}</Text>
                  <CoinIcon size={16} color={item.credit_journal.credit_type == 'silver' ? '#EB4335' : '#E0AE1E'} />
                </View>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>{t("usageReceiptModal.remainingPoints")}</Text>
                <View style={styles.modalItemPoints}>
                  <Text>{item.credit_journal.credits_after}</Text>
                  <CoinIcon size={16} color={item.credit_journal.credit_type == 'silver' ? '#EB4335' : '#E0AE1E'} />
                </View>
              </View>
              {
                item.response_data && (
                  <AppButton title={t("usageReceiptModal.seeResults")} style={{ marginTop: 18 }} onPress={handleResult} />
                )
              }
            </>
          ) : (
            <View style={{ marginVertical: 16 }}>
              <Text style={{ textAlign: "center", color: "#888", fontSize: 15 }}>
                {t("usageReceiptModal.processing")}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 340,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    color: "#C1976B",
    letterSpacing: 1,
    flex: 1,
    textAlign: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#222",
    paddingHorizontal: 8,
    fontWeight: "bold",
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  modalLabel: {
    color: "#888",
    fontSize: 14,
    flex: 1,
  },
  modalValue: {
    color: "#222",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  modalSectionDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 10,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },
  modalItemIcon: {
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral,
    borderRadius: 8
  },
  modalItemName: {
    fontSize: 15,
    color: "#222",
    flex: 1,
  },
  modalItemPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  modalTotalLabel: {
    fontSize: 15,
    color: "#888",
    fontWeight: "bold",
    marginRight: 4,
  },
  modalTotalValue: {
    fontSize: 15,
    color: "#222",
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
  },
  modalPointsUsed: {
    color: "#E05A47",
    fontWeight: "bold",
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  modalPointsTotal: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default UsageReceiptModal;
