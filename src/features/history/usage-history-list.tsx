import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View, ActivityIndicator } from "react-native";
import CommentsIcon from "../../components/icons/profile/comments-icon";
import { fontFamilies } from "../../constants/fonts";
import api from "../../utils/http";
import { formatDateTime } from "../../utils/date";
import { StyleSheet } from "react-native";

interface UsageItem {
    usage_history_id: number;
    service_type: string;
    request_data: string;
    response_data: string;
    created_at: string;
    updated_at: string;
    user: {
        user_id: number;
        full_name: string;
        email: string;
    };
}

interface UsageHistoryListProps {
    onItemPress?: (item: UsageItem) => void;
}

const serviceTypeLabels: Record<string, string> = {
    ask_any_question: "Ask Affinity",
    love_forecast: "Love Forecast",
    transit_report: "Fortune Report",
    relationship_compatibility: "Relation Compatibility",
    advice_genie: "Advice Genie",
};

const getServiceTypeLabel = (type: string) => serviceTypeLabels[type] || type;

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
    serviceType: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
        fontFamily: fontFamilies.ARCHIVO.light,
    },
    details: {
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
});

const UsageHistoryList: React.FC<UsageHistoryListProps> = ({ onItemPress }) => {
    const [data, setData] = useState<UsageItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsageHistories = async () => {
            setLoading(true);
            try {
                const res = await api.get("/v1/usage-histories?limit=10&offset=0");
                setData(res.data?.rows || []);
            } catch {
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsageHistories();
    }, []);

    const renderUsageItem = ({ item }: { item: UsageItem }) => {
        // Format date
        const formattedDate = formatDateTime(item.created_at);

        return (
            <Pressable
                style={styles.pressable}
                onPress={() => onItemPress?.(item)}
            >
                <View style={styles.iconContainer}>
                    <CommentsIcon />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.serviceType}>
                        {getServiceTypeLabel(item.service_type)}
                    </Text>
                    <Text style={styles.details}>
                        Your purchase is in, see the details!
                    </Text>
                </View>
                <View style={styles.dateContainer}>
                    <Text style={styles.date}>
                        {formattedDate}
                    </Text>
                </View>
            </Pressable>
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
            renderItem={renderUsageItem}
            keyExtractor={(item) => String(item.usage_history_id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No usage history found.</Text>
                </View>
            }
        />
    );
};

export default UsageHistoryList;
