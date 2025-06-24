import React from "react";
import { Modal, SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CoinIcon from "../../components/icons/profile/coin-icon";
import { formatDateTime } from "../../utils/date";

interface TopupReceiptModalProps {
    visible: boolean;
    onClose: () => void;
    item: any
}

const TopupReceiptModal: React.FC<TopupReceiptModalProps> = ({ visible, onClose, item }) => {
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
                        <Text style={styles.modalTitle}>RECEIPT</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Order Number</Text>
                        <Text style={styles.modalValue}>{item.transaction_id}</Text>
                    </View>
                    <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Date Purchased</Text>
                        <Text style={styles.modalValue}>
                            {formatDateTime(item.created_at)}
                        </Text>
                    </View>
                    <View style={styles.modalSectionDivider} />
                    <Text style={styles.modalSectionTitle}>Order Item(s)</Text>
                    <View style={styles.modalRow}>
                        <View style={styles.modalItemIcon}>
                            <CoinIcon size={20} color="#E0AE1E" />
                        </View>
                        <Text style={styles.modalItemQty}>
                            {item.package?.name || item.subscription?.name || item.topup_type}
                        </Text>
                        <Text style={styles.modalItemPrice}>
                            ${item.package?.price || item.subscription?.price || item.amount_paid}
                        </Text>
                    </View>
                    <View style={styles.modalRow}>
                        <View style={{ flex: 1 }} />
                        <Text style={styles.modalTotalLabel}>Total:</Text>
                        <Text style={styles.modalTotalValue}>
                            ${item.amount_paid}
                        </Text>
                    </View>
                    <View style={styles.modalSectionDivider} />
                    <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Payment Method</Text>
                        <Text style={styles.modalValue}>{item.payment_method}</Text>
                    </View>
                    <View style={styles.modalSectionDivider} />
                    <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Previous Points</Text>
                        <Text style={styles.modalPoints}>150 <CoinIcon size={14} color="#E0AE1E" /></Text>
                    </View>
                    <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Points Added</Text>
                        <Text style={styles.modalPointsAdded}>+55 <CoinIcon size={14} color="#E0AE1E" /></Text>
                    </View>
                    <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Total Points</Text>
                        <Text style={styles.modalPointsTotal}>205 <CoinIcon size={14} color="#E0AE1E" /></Text>
                    </View>
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
});

export default TopupReceiptModal;
