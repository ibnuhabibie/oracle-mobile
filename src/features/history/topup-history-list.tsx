import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, Text, View, ActivityIndicator } from "react-native";
import { StyleSheet } from "react-native";

import { fontFamilies } from "../../constants/fonts";
import CartIcon from "../../components/icons/profile/cart-icon";
import CoinIcon from "../../components/icons/profile/coin-icon";
import api from "../../utils/http";
import { formatDateTime } from "../../utils/date";
import { useTranslation } from "react-i18next";
import { COLORS } from "../../constants/colors";

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

const LIMIT = 10;

const TopupHistoryList: React.FC<TopupHistoryListProps> = ({ onItemPress }) => {
    const { t } = useTranslation();
    const [data, setData] = useState<TopUpItem[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [endReached, setEndReached] = useState(false);

    // Fetch page (initial and paginated)
    const fetchPage = useCallback(async () => {
        if (loading || endReached) return;
        setLoading(true);
        try {
            const res = await api.get(`/v1/topup-histories?limit=${LIMIT}&offset=${offset}`);
            const rows: TopUpItem[] = res.data?.rows || [];
            if (rows.length < LIMIT) setEndReached(true);
            setData(prev => {
                const merged = [...prev, ...rows];
                const uniqueMap = new Map<number, TopUpItem>();
                for (const item of merged) {
                    uniqueMap.set(item.topup_history_id, item);
                }
                return Array.from(uniqueMap.values());
            });
            setOffset(prev => prev + LIMIT);
        } catch (err) {
            // Optionally handle error
        } finally {
            setLoading(false);
        }
    }, [offset, loading, endReached]);

    // Initial load
    useEffect(() => {
        if (data.length) return;
        fetchPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderTopUpItem = ({ item }: { item: TopUpItem }) => {
        const formattedDate = formatDateTime(item.created_at);

        return (
            <Pressable
                style={styles.pressable}
                onPress={() => onItemPress?.(item)}
            >
                <View style={styles.iconContainer}>
                    <CartIcon size={20} />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                        <Text style={styles.packageName}>
                            {item.package?.name || item.subscription?.name || item.topup_type}
                        </Text>
                        <CoinIcon size={19} color={item.package ? "#EB4335" : "#E0AE1E"} />
                    </View>
                    <Text style={styles.transaction}>{item.transaction_id} - ${item.amount}</Text>
                </View>
                <View style={styles.dateContainer}>
                    <Text style={styles.date}>
                        {formattedDate}
                    </Text>
                </View>
            </Pressable >
        );
    };

    const renderFooter = () => {
        if (!loading || data.length === 0) return null;
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="small" />
            </View>
        );
    };

    // Debounce for onEndReached
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const debouncedOnEndReached = useCallback(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            fetchPage();
        }, 300); // 300ms debounce
    }, [fetchPage]);

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return (
        <FlatList
            data={data}
            renderItem={renderTopUpItem}
            keyExtractor={(item) => String(item.topup_history_id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>{t("NO TOPUP HISTORY FOUND")}</Text>
                </View>
            }
            onEndReached={debouncedOnEndReached}
            onEndReachedThreshold={0.6}
            ListFooterComponent={renderFooter}
        />
    );
};

const styles = StyleSheet.create({
    pressable: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        // marginBottom: 4,
    },
    packageName: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.neutral,
        marginRight: 8,
        fontFamily: fontFamilies.ARCHIVO.light,
    },
    transaction: {
        fontSize: 12,
        color: COLORS.neutral,
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
