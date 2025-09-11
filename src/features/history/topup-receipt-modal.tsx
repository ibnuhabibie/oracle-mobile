import React from "react";
import { Modal, SafeAreaView, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { AppText } from '../../components/ui/app-text';
import { AppButton } from '../../components/ui/app-button';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import CoinIcon from "../../components/icons/profile/coin-icon";
import { formatDateTime } from "../../utils/date";
import { useTranslation } from "react-i18next";
import { COLORS } from "../../constants/colors";
import CloseIcon from "../../components/icons/close-icon";
import { scaleFont, scaleSize } from "../../utils/scale";

interface TopupReceiptModalProps {
    visible: boolean;
    onClose: () => void;
    item: any;
}

const TopupReceiptModal: React.FC<TopupReceiptModalProps> = ({ visible, onClose, item }) => {
    const { t } = useTranslation();

    const handleContinuePayment = async () => {
        if (!item?.payment_intent) return;
        try {
            const { error: initError } = await initPaymentSheet({
                paymentIntentClientSecret: item.payment_intent,
                merchantDisplayName: "OracleAI"
            });
            if (initError) {
                // Optionally show error to user
                return;
            }
            const { error: presentError } = await presentPaymentSheet();
            if (presentError) {
                // Optionally show error to user
                return;
            }
            // Optionally handle success
        } catch (err) {
            // Optionally show error to user
        }
    };

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
                                    <CloseIcon size={scaleSize(16, 14, 22)} />
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
                            <AppText variant="body1" style={styles.modalSectionTitle} color="neutral">{t("ORDER ITEMS")}</AppText>
                            <View style={styles.modalRow}>
                                <View style={styles.modalItemIcon}>
                                    <CoinIcon size={scaleSize(16, 14, 20)} type={item.topup_type == 'package' ? 'silver' : 'gold'} />
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
                                                    <CoinIcon size={scaleSize(10, 10, 14)} type={item.topup_type == 'package' ? 'silver' : 'gold'} />
                                                </View>
                                            </View>
                                            <View style={styles.modalRow}>
                                                <AppText variant="caption1" color="neutral">{t("POINTS ADDED")}</AppText>
                                                <View style={styles.textCoinWrapper}>
                                                    <AppText variant="caption1" style={styles.modalPointsCommon} color="green">+{item.credit_journal.credits_used}</AppText>
                                                    <CoinIcon size={scaleSize(10, 10, 14)} type={item.topup_type == 'package' ? 'silver' : 'gold'} />
                                                </View>
                                            </View>
                                            <View style={styles.modalRow}>
                                                <AppText variant="caption1" color="neutral">{t("TOTAL POINTS")}</AppText>
                                                <View style={styles.textCoinWrapper}>
                                                    <AppText variant="caption1" style={styles.modalPointsCommon} color="neutral">{item.credit_journal.credits_after}</AppText>
                                                    <CoinIcon size={scaleSize(10, 10, 14)} type={item.topup_type == 'package' ? 'silver' : 'gold'} />
                                                </View>
                                            </View>
                                        </>
                                    ) :
                                    (
                                        <>
                                            <View style={{ marginVertical: 16 }}>
                                                <AppText variant="body1" style={{ textAlign: "center" }} color="neutral">
                                                    {t("PAYMENT NOT COMPLETED")}
                                                </AppText>
                                                {
                                                    item.payment_status === "pending" && (
                                                        <AppButton
                                                            style={{ marginTop: 12, alignSelf: "center" }}
                                                            onPress={handleContinuePayment}
                                                            title={t("CONTINUE PAYMENT")}
                                                        />
                                                    )
                                                }
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
        borderWidth: scaleSize(1),
        borderColor: COLORS.neutral,
        borderRadius: scaleSize(12, 12, 16),
        padding: scaleSize(14, 14, 20),
        width: "90%",
        // maxWidth: scaleSize(260, 260, 400),
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
        textTransform: 'uppercase',
        fontSize: scaleFont(16, 12, 20),
    },
    modalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: scaleSize(2, 2, 4),
    },
    modalSectionDivider: {
        height: scaleSize(1),
        backgroundColor: "#686868",
        marginVertical: scaleSize(6, 6, 10),
    },
    modalSectionTitle: {
        fontWeight: "bold",
        marginBottom: scaleSize(4, 4, 6),
        fontSize: scaleFont(14, 12, 18),
    },
    modalItemIcon: {
        marginRight: scaleSize(6, 6, 8),
    },
    modalItemQty: {
        flex: 1,
        fontSize: scaleFont(12, 10, 16),
    },
    modalItemPrice: {
        fontWeight: "600",
        marginLeft: scaleSize(6, 6, 8),
        fontSize: scaleFont(12, 10, 16),
    },
    modalTotalLabel: {
        fontWeight: "bold",
        marginRight: scaleSize(2, 2, 4),
        fontSize: scaleFont(12, 10, 16),
    },
    modalTotalValue: {
        fontWeight: "bold",
        fontSize: scaleFont(12, 10, 16),
    },
    modalPointsCommon: {
        fontWeight: "bold",
        flexDirection: "row",
        alignItems: "center",
        fontSize: scaleFont(12, 10, 16),
    },
    textCoinWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scaleSize(2, 2, 4)
    }
});

export default TopupReceiptModal;
