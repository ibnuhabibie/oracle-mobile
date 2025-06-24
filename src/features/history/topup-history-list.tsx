import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View, ActivityIndicator } from "react-native";
import { StyleSheet } from "react-native";

import { fontFamilies } from "../../constants/fonts";
import CartIcon from "../../components/icons/profile/cart-icon";
import CoinIcon from "../../components/icons/profile/coin-icon";
import api from "../../utils/http";
import { formatDateTime } from "../../utils/date";

interface TopUpItem {
    topup_history_id: number;
    user_id: number;
    package_id: number;
    subscription_id: number | null;
    topup_type: string;
    amount_paid: string;
    payment_status: string;
    payment_method: string;
    transaction_id: string;
    created_at: string;
    updated_at: string;
    user: {
        user_id: number;
        full_name: string;
        email: string;
    };
    package: {
        package_id: number;
        name: string;
        price: string;
    } | null;
    subscription: {
        subscription_id: number;
        name: string;
        price: number;
    } | null;
}

interface TopupHistoryListProps {
    onItemPress?: (item: TopUpItem) => void;
}

const TopupHistoryList: React.FC<TopupHistoryListProps> = ({ onItemPress }) => {
    const [data, setData] = useState<TopUpItem[]>([]);
    const [loading, setLoading] = useState(true);

    const handleItemPress = (item: TopUpItem) => {
        onItemPress?.(item);
    };

    useEffect(() => {
        const fetchTopupHistories = async () => {
            setLoading(true);
            try {
                const res = await api.get("/v1/topup-histories?limit=10&offset=0");
                setData(res.data?.rows || []);
            } catch {
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTopupHistories();
    }, []);

    const renderTopUpItem = ({ item }: { item: TopUpItem }) => {
        const formattedDate = formatDateTime(item.created_at);

        return (
            <Pressable
                style={styles.pressable}
                onPress={() => handleItemPress(item)}
            >
                <View style={styles.iconContainer}>
                    <CartIcon size={24} />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                        <Text style={styles.packageName}>
                            {item.package?.name || item.subscription?.name || item.topup_type}
                        </Text>
                        <CoinIcon size={19} color={item.package ? "#EB4335" : "#E0AE1E"} />
                    </View>
                    <Text style={styles.transaction}>Top-up complete! You’re good to go.</Text>
                </View>
                <View style={styles.dateContainer}>
                    <Text style={styles.date}>
                        {formattedDate}
                    </Text>
                </View>
            </Pressable >
        );
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="small" />
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            renderItem={renderTopUpItem}
            keyExtractor={(item) => String(item.topup_history_id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No top up history found.</Text>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    pressable: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F8F8F8",
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    packageName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginRight: 8,
        fontFamily: fontFamilies.ARCHIVO.light,
    },
    transaction: {
        fontSize: 14,
        color: "#666",
        fontFamily: fontFamilies.ARCHIVO.light,
    },
    dateContainer: {
        alignItems: "flex-end",
    },
    date: {
        fontSize: 12,
        color: "#999",
        fontFamily: fontFamilies.ARCHIVO.light,
    },
    loading: {
        padding: 24,
        alignItems: "center",
    },
    empty: {
        alignItems: "center",
        marginTop: 32,
    },
    emptyText: {
        color: "#999",
        fontFamily: fontFamilies.ARCHIVO.light,
    },
    listContent: {
        paddingBottom: 20,
    },
    // ...existing styles
});

export default TopupHistoryList;
