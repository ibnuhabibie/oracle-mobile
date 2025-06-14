import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View, ActivityIndicator } from "react-native";
import CartIcon from "../../components/icons/Cart";
import CoinIcon from "../../components/icons/Coin";
import { fontFamilies } from "../../constants/fonts";
import api from "../../utils/http";

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
    };
    subscription: any | null;
}

interface TopupHistoryListProps {
    onItemPress?: (item: TopUpItem) => void;
}

const TopupHistoryList: React.FC<TopupHistoryListProps> = ({ onItemPress }) => {
    const [data, setData] = useState<TopUpItem[]>([]);
    const [loading, setLoading] = useState(true);

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
                    <CartIcon size={24} />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                        <Text style={{ fontSize: 16, fontWeight: "600", color: "#333", marginRight: 8, fontFamily: fontFamilies.ARCHIVO.light }}>
                            {item.package?.name || item.topup_type}
                        </Text>
                        <CoinIcon size={19} />
                    </View>
                    <Text style={{ fontSize: 14, color: "#666", fontFamily: fontFamilies.ARCHIVO.light }}>
                        Transaction: {item.transaction_id}
                    </Text>
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
            renderItem={renderTopUpItem}
            keyExtractor={(item) => String(item.topup_history_id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
                <View style={{ alignItems: "center", marginTop: 32 }}>
                    <Text style={{ color: "#999", fontFamily: fontFamilies.ARCHIVO.light }}>No top up history found.</Text>
                </View>
            }
        />
    );
};

export default TopupHistoryList;
