import React from "react";
import { Modal, SafeAreaView, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { AppText } from '../../components/ui/app-text';
import CoinIcon from "../../components/icons/profile/coin-icon";
import { formatDateTime } from "../../utils/date";
import { useTranslation } from "react-i18next";
import { COLORS } from "../../constants/colors";
import CloseIcon from "../../components/icons/close-icon";

interface TopupReceiptModalProps {
    visible: boolean;
    onClose: () => void;
    item: any
}

const TopupReceiptModal: React.FC<TopupReceiptModalProps> = ({ visible, onClose, item }) => {
    const { t } = useTranslation();

    if (!item) {
        return null;
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <AppText variant="subtitle2" style={styles.modalTitle} color="primary">{t("RECEIPT")}</AppText>
                                <TouchableOpacity onPress={onClose}>
                                    <CloseIcon size={22} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalRow}>
                                <AppText variant="caption1" color="neutral">{t("ORDER NUMBER")}</AppText>
                                <AppText variant="caption1" color="white">{item.transaction_id}</AppText>
                            </View>
                            <View style={styles.modalRow}>
                                <AppText variant="caption1" color="neutral">{t("DATE PURCHASED")}</AppText>
                                <AppText variant="caption1" color="white">
                                    {formatDateTime(item.created_at)}
                                </AppText>
                            </View>
                            <View style={styles.modalSectionDivider} />
                            <AppText variant="body1" style={styles.modalSectionTitle}>{t("ORDER ITEMS")}</AppText>
                            <View style={styles.modalRow}>
                                <View style={styles.modalItemIcon}>
                                    <CoinIcon size={20} color={item.topup_type == 'package' ? 'red' : "#E0AE1E"} />
                                </View>
                                <AppText variant="body1" style={styles.modalItemQty} color="neutral">
                                    {item.package?.name || item.subscription?.name || item.topup_type}
                                </AppText>
                                <AppText variant="body1" style={styles.modalItemPrice} color="neutral">
                                    ${item.amount}
                                </AppText>
                            </View>
                            <View style={styles.modalRow}>
                                <View style={{ flex: 1 }} />
                                <AppText variant="body1" style={styles.modalTotalLabel} color="neutral">{t("TOTAL")}</AppText>
                                <AppText variant="body1" style={styles.modalTotalValue} color="neutral">
                                    ${item.amount}
                                </AppText>
                            </View>
                            <View style={styles.modalSectionDivider} />

                            {
                                item.credit_journal ?
                                    (
                                        <>
                                            <View style={styles.modalRow}>
                                                <AppText variant="caption1" color="neutral">{t("PAYMENT METHOD")}</AppText>
                                                <AppText variant="caption1" color="white">{JSON.parse(item.payment_method).type}</AppText>
                                            </View>
                                            <View style={styles.modalSectionDivider} />
                                            <View style={styles.modalRow}>
                                                <AppText variant="caption1" color="neutral">{t("PREVIOUS POINTS")}</AppText>
                                                <View style={styles.textCoinWrapper}>
                                                    <AppText variant="caption1" style={styles.modalPointsCommon} color="neutral">{item.credit_journal.credits_before}</AppText>
                                                    <CoinIcon size={14} color={item.topup_type == 'package' ? "red" : "#E0AE1E"} />
                                                </View>
                                            </View>
                                            <View style={styles.modalRow}>
                                                <AppText variant="caption1" color="neutral">{t("POINTS ADDED")}</AppText>
                                                <View style={styles.textCoinWrapper}>
                                                    <AppText variant="caption1" style={styles.modalPointsCommon} color="green">+{item.credit_journal.credits_used}</AppText>
                                                    <CoinIcon size={14} color={item.topup_type == 'package' ? "red" : "#E0AE1E"} />
                                                </View>
                                            </View>
                                            <View style={styles.modalRow}>
                                                <AppText variant="caption1" color="neutral">{t("TOTAL POINTS")}</AppText>
                                                <View style={styles.textCoinWrapper}>
                                                    <AppText variant="caption1" style={styles.modalPointsCommon} color="neutral">{item.credit_journal.credits_after}</AppText>
                                                    <CoinIcon size={14} color={item.topup_type == 'package' ? "red" : "#E0AE1E"} />
                                                </View>
                                            </View>
                                        </>
                                    ) :
                                    (
                                        <>
                                            <View style={{ marginVertical: 16 }}>
                                                <AppText variant="body1" style={{ textAlign: "center", color: COLORS.neutral, fontSize: 15 }}>
                                                    {t("PAYMENT NOT COMPLETED")}
                                                </AppText>
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(30,30,30,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    modalContent: {
        backgroundColor: '#3F3F3F80',
        borderWidth: 1,
        borderColor: COLORS.neutral,
        borderRadius: 16,
        padding: 20,
        width: "90%",
        maxWidth: 400,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    modalTitle: {
        letterSpacing: 1.3,
        flex: 1,
        textAlign: "center",
        textTransform: 'uppercase'
    },
    modalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 4,
    },
    modalLabel: {
        color: COLORS.neutral,
        fontSize: 14,
    },
    modalValue: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: "600",
        flex: 1,
        textAlign: "right",
        textTransform: 'capitalize'
    },
    modalSectionDivider: {
        height: 1,
        backgroundColor: "#686868",
        marginVertical: 10,
    },
    modalSectionTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: COLORS.neutral,
        marginBottom: 6,
    },
    modalItemIcon: {
        marginRight: 8,
    },
    modalItemQty: {
        flex: 1,
    },
    modalItemPrice: {
        fontWeight: "600",
        marginLeft: 8,
    },
    modalTotalLabel: {
        fontWeight: "bold",
        marginRight: 4,
    },
    modalTotalValue: {
        fontWeight: "bold",
    },
    modalPointsCommon: {
        fontWeight: "bold",
        flexDirection: "row",
        alignItems: "center",
    },
    textCoinWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    }
});

export default TopupReceiptModal;
