import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View, ActivityIndicator } from "react-native";
import CommentsIcon from "../../components/icons/profile/comments-icon";
import CoinIcon from "../../components/icons/profile/coin-icon";
import { fontFamilies } from "../../constants/fonts";
import api from "../../utils/http";

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
        // Parse request_data for display (example: show partner1/partner2 birth dates)
        let requestSummary = "";
        try {
            const req = JSON.parse(item.request_data);
            if (req.partner1_birth_date && req.partner2_birth_date) {
                requestSummary = `Partner1: ${req.partner1_birth_date}, Partner2: ${req.partner2_birth_date}`;
            } else {
                requestSummary = item.request_data;
            }
        } catch {
            requestSummary = item.request_data;
        }

        // Format date
        const dateObj = new Date(item.created_at);
        // Format: 25 Jan 2025 10:00
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = dateObj.toLocaleString('en-US', { month: 'short' });
        const year = dateObj.getFullYear();
        const hour = dateObj.getHours().toString().padStart(2, '0');
        const minute = dateObj.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${day} ${month} ${year} ${hour}:${minute}`;

        return (
            <Pressable
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: "#F8F8F8",
                }}
                onPress={() => onItemPress?.(item)}
            >
                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "#F5F5F5",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 16,
                    }}
                >
                    <CommentsIcon />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 4, fontFamily: fontFamilies.ARCHIVO.light }}>
                        {item.service_type}
                    </Text>
                    <Text style={{ fontSize: 14, color: "#666", fontFamily: fontFamilies.ARCHIVO.light }}>{requestSummary}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 12, color: "#999", fontFamily: fontFamilies.ARCHIVO.light }}>
                        {formattedDate}
                    </Text>
                </View>
            </Pressable>
        );
    };

    if (loading) {
        return (
            <View style={{ padding: 24, alignItems: "center" }}>
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
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
                <View style={{ alignItems: "center", marginTop: 32 }}>
                    <Text style={{ color: "#999", fontFamily: fontFamilies.ARCHIVO.light }}>No usage history found.</Text>
                </View>
            }
        />
    );
};

export default UsageHistoryList;
