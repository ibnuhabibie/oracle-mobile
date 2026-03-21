import React, { useCallback, useEffect, useRef, useState, memo } from "react";
import { FlatList, Pressable, View, ActivityIndicator } from "react-native";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

import { AppText } from '../../../components/ui/app-text';
import CartIcon from "../../../components/icons/profile/cart-icon";
import CoinIcon from "../../../components/icons/profile/coin-icon";

import api from "../../../utils/http";
import { formatDateWithTime } from "../../../utils/date";
import { scaleFont, scaleSize } from "../../../utils/scale";
import { formatPrice } from "../../../utils/formatter";

import type { TopUpItem, TopupHistoryListProps } from './types';

const LIMIT = 10;

// Memoized list item for better performance
const TopupItem = memo(({ item, onPress }: { item: TopUpItem; onPress: (item: TopUpItem) => void }) => {
    const { t } = useTranslation();
    const formattedDate = formatDateWithTime(item.created_at);

    const handlePress = useCallback(() => onPress(item), [item, onPress]);

    return (
        <Pressable
            style={styles.pressable}
            onPress={handlePress}
        >
            <View style={styles.iconContainer}>
                <CartIcon size={scaleSize(16)} />
            </View>
            <View style={{ flex: 1 }}>
                <View style={styles.row}>
                    <AppText variant="body2" style={styles.packageName} color="neutral">
                        {item.package?.name || item.subscription?.name || item.topup_type}
                    </AppText>
                    <CoinIcon size={scaleSize(14, 14, 19)} type={item.package ? 'silver' : 'gold'} />
                </View>
                <AppText variant="caption4" color="neutral">{item.transaction_id} - {formatPrice(parseFloat(item.amount), item.currency_symbol)}</AppText>
            </View>
            <View style={styles.dateContainer}>
                <AppText variant="caption4" color="gray" >
                    {formattedDate}
                </AppText>
            </View>
        </Pressable >
    );
});

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

    // Debounce for onEndReached
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

    // Initial load
    useEffect(() => {
        if (data.length) return;
        fetchPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Memoize footer component
    const Footer = useCallback(() => {
        if (!loading || data.length === 0) return null;
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="small" />
            </View>
        );
    }, [loading, data.length]);

    // Memoize empty component
    const EmptyComponent = useCallback(() => (
        <View style={styles.empty}>
            <AppText variant="caption2" color="gray">{t("topup.noHistoryFound")}</AppText>
        </View>
    ), [t]);

    // Safe press handler that handles undefined onItemPress
    const handleItemPress = useCallback((item: TopUpItem) => {
        if (onItemPress) onItemPress(item);
    }, [onItemPress]);

    return (
        <FlatList
            data={data}
            renderItem={({ item }) => <TopupItem item={item} onPress={handleItemPress} />}
            keyExtractor={(item) => String(item.topup_history_id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={EmptyComponent}
            onEndReached={debouncedOnEndReached}
            onEndReachedThreshold={0.6}
            ListFooterComponent={Footer}
        />
    );
};

const styles = StyleSheet.create({
    pressable: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: scaleSize(12, 12, 16),
    },
    iconContainer: {
        width: scaleSize(28, 28, 40),
        height: scaleSize(28, 28, 40),
        borderRadius: scaleSize(14, 14, 20),
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: "center",
        alignItems: "center",
        marginRight: scaleSize(6, 6, 8),
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    packageName: {
        fontWeight: "600",
        marginRight: scaleSize(6, 6, 8),
        fontSize: scaleFont(14, 12, 18),
    },
    dateContainer: {
        alignItems: "flex-end",
    },
    loading: {
        padding: scaleSize(16, 16, 24),
        alignItems: "center",
    },
    empty: {
        alignItems: "center",
        marginTop: scaleSize(24, 24, 32),
    },
    listContent: {
        paddingBottom: scaleSize(14, 14, 20),
    },
});

export default TopupHistoryList;