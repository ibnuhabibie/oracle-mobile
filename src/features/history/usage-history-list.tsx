import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, View, ActivityIndicator } from "react-native";
import { AppText } from '../../components/ui/app-text';
import CommentsIcon from "../../components/icons/profile/comments-icon";
import api from "../../utils/http";
import { formatDateWithTime } from "../../utils/date";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { scaleFont, scaleSize } from "../../utils/scale";

interface UsageItem {
    usage_history_id: number;
    service_type: string;
    request_data: string;
    response_data: string;
    created_at: string;
    updated_at: string;
    payment_status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
    payment_type: 'direct' | 'credit';
    user: {
        user_id: number;
        full_name: string;
        email: string;
    };
}

interface UsageHistoryListProps {
    onItemPress?: (item: UsageItem) => void;
}

const getServiceTypeLabel = (type: string, t: (key: string) => string) =>
    t(`serviceLabel.${type}`) || type;

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
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: scaleSize(10, 10, 16),
    },
    serviceType: {
        fontWeight: "600",
        fontSize: scaleFont(14, 12, 18),
    },
    dateContainer: {
        alignItems: "flex-end",
        marginLeft: scaleSize(8),
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

const LIMIT = 10;

const UsageHistoryList: React.FC<UsageHistoryListProps> = ({ onItemPress }) => {
    const { t } = useTranslation();
    const [data, setData] = useState<UsageItem[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [endReached, setEndReached] = useState(false);

    // Fetch page (initial and paginated)
    const fetchPage = useCallback(async () => {
        console.log('called')
        if (loading || endReached) return;
        setLoading(true);
        try {
            const res = await api.get(`/v1/usage-histories?limit=${LIMIT}&offset=${offset}`);
            const rows: UsageItem[] = res.data?.rows || [];

            if (rows.length < LIMIT) setEndReached(true);
            setData(prev => {
                const merged = [...prev, ...rows];
                const uniqueMap = new Map<number, UsageItem>();
                for (const item of merged) {
                    uniqueMap.set(item.usage_history_id, item);
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

    const renderUsageItem = ({ item }: { item: UsageItem }) => {
        const formattedDate = formatDateWithTime(item.created_at);
        let details = t("usageHistory.details")
        
        if (item.payment_type == 'direct' && item.payment_status == 'pending') {
            details = t("usageHistory.paymentPending")
        }

        return (
            <Pressable
                style={styles.pressable}
                onPress={() => onItemPress?.(item)}
            >
                <View style={styles.iconContainer}>
                    <CommentsIcon size={scaleSize(16)} />
                </View>
                <View style={{ flex: 1 }}>
                    <AppText variant="body2" style={styles.serviceType} color="neutral">
                        {getServiceTypeLabel(item.service_type, t)}
                    </AppText>
                    <AppText variant="caption4" color="neutral">
                        {details}
                    </AppText>
                </View>
                <View style={styles.dateContainer}>
                    <AppText variant="caption4" color="gray">
                        {formattedDate}
                    </AppText>
                </View>
            </Pressable>
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

    return (
        <FlatList
            data={data}
            renderItem={renderUsageItem}
            keyExtractor={(item) => String(item.usage_history_id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
                <View style={styles.empty}>
                    <AppText variant="caption2" color="gray">{t("usageHistory.noHistoryFound")}</AppText>
                </View>
            }
            onEndReached={fetchPage}
            onEndReachedThreshold={0.6}
            ListFooterComponent={renderFooter}
        />
    );
};

export default UsageHistoryList;
