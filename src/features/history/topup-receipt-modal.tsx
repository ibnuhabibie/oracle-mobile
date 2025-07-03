import React from "react";
import { Modal, SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CoinIcon from "../../components/icons/profile/coin-icon";
import { formatDateTime } from "../../utils/date";
import { useTranslation } from "react-i18next";

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
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{t("RECEIPT")}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>{t("ORDER NUMBER")}</Text>
                        <Text style={styles.modalValue}>{item.transaction_id}</Text>
                    </View>
                    <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>{t("DATE PURCHASED")}</Text>
                        <Text style={styles.modalValue}>
                            {formatDateTime(item.created_at)}
                        </Text>
                    </View>
                    <View style={styles.modalSectionDivider} />
                    <Text style={styles.modalSectionTitle}>{t("ORDER ITEMS")}</Text>
                    <View style={styles.modalRow}>
                        <View style={styles.modalItemIcon}>
                            <CoinIcon size={20} color={item.topup_type == 'package' ? 'red' : "#E0AE1E"} />
                        </View>
                        <Text style={styles.modalItemQty}>
                            {item.package?.name || item.subscription?.name || item.topup_type}
                        </Text>
                        <Text style={styles.modalItemPrice}>
                            ${item.amount}
                        </Text>
                    </View>
                    <View style={styles.modalRow}>
                        <View style={{ flex: 1 }} />
                        <Text style={styles.modalTotalLabel}>{t("TOTAL")}</Text>
                        <Text style={styles.modalTotalValue}>
                            ${item.amount}
                        </Text>
                    </View>
                    <View style={styles.modalSectionDivider} />

                    {
                        item.credit_journal ?
                            (
                                <>
                                    <View style={styles.modalRow}>
                                        <Text style={styles.modalLabel}>{t("PAYMENT METHOD")}</Text>
                                        <Text style={styles.modalValue}>{JSON.parse(item.payment_method).type}</Text>
                                    </View>
                                    <View style={styles.modalSectionDivider} />
                                    <View style={styles.modalRow}>
                                        <Text style={styles.modalLabel}>{t("PREVIOUS POINTS")}</Text>
                                        <View style={styles.textCoinWrapper}>
                                            <Text style={styles.modalPoints}>{item.credit_journal.credits_before}</Text>
                                            <CoinIcon size={14} color={item.topup_type == 'package' ? "red" : "#E0AE1E"} />
                                        </View>
                                    </View>
                                    <View style={styles.modalRow}>
                                        <Text style={styles.modalLabel}>{t("POINTS ADDED")}</Text>
                                        <View style={styles.textCoinWrapper}>
                                            <Text style={styles.modalPointsAdded}>+{item.credit_journal.credits_used}</Text>
                                            <CoinIcon size={14} color={item.topup_type == 'package' ? "red" : "#E0AE1E"} />
                                        </View>
                                    </View>
                                    <View style={styles.modalRow}>
                                        <Text style={styles.modalLabel}>{t("TOTAL POINTS")}</Text>
                                        <View style={styles.textCoinWrapper}>
                                            <Text style={styles.modalPointsTotal}>{item.credit_journal.credits_after}</Text>
                                            <CoinIcon size={14} color={item.topup_type == 'package' ? "red" : "#E0AE1E"} />
                                        </View>
                                    </View>
                                </>
                            ) :
                            (
                                <>
                                    <View style={{ marginVertical: 16 }}>
                                        <Text style={{ textAlign: "center", color: "#888", fontSize: 15 }}>
                                            {t("PAYMENT NOT COMPLETED")}
                                        </Text>
                                    </View>
                                </>
                            )
                    }
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    modalContent: {
        backgroundColor: "#fff",
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
        fontSize: 18,
        fontWeight: "bold",
        color: "#222",
        letterSpacing: 1,
        flex: 1,
        textAlign: "center",
    },
    closeButtonText: {
        fontSize: 28,
        color: "#999",
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
        textTransform: 'capitalize'
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
    },
    modalItemQty: {
        fontSize: 15,
        color: "#222",
        flex: 1,
    },
    modalItemPrice: {
        fontSize: 15,
        color: "#222",
        fontWeight: "600",
        marginLeft: 8,
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
    },
    modalPoints: {
        color: "#222",
        fontWeight: "bold",
        fontSize: 14,
        flexDirection: "row",
        alignItems: "center",
    },
    modalPointsAdded: {
        color: "#4CAF50",
        fontWeight: "bold",
        fontSize: 14,
        flexDirection: "row",
        alignItems: "center",
    },
    modalPointsTotal: {
        color: "#222",
        fontWeight: "bold",
        fontSize: 14,
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
