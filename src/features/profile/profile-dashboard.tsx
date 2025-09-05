import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import { AppText } from "../../components/ui/app-text";
import { COLORS } from "../../constants/colors";
import { fontFamilies } from "../../constants/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CircularScore from "../../components/widgets/circular-score";
import api from "../../utils/http";
import { formatDateToShortHeader } from "../../utils/date";

interface UserProfile {
    full_name?: string;
    [key: string]: any;
}

interface DailyProfileData {
    today_description?: string;
    today_points?: number;
    today_wealth_points?: number;
    today_study_points?: number;
    today_relationship_points?: number;
    today_career_points?: number;
    [key: string]: any;
}

const ProfileDashboard: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [data, setData] = useState<DailyProfileData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserAndProfile = async () => {
            try {
                setLoading(true);
                const userData = await AsyncStorage.getItem('user_profile');
                setUser(JSON.parse(userData || ''));
                const response = await api.get('/v1/users/daily-profile');
                setData(response.data.content);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load user data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserAndProfile();
    }, []);

    const today_description = data?.today_description;

    function LocalizedHeader() {
        const { t } = useTranslation();
        const today = new Date();
        const formattedDate = formatDateToShortHeader(today);

        return (
            <View style={styles.header}>
                <AppText variant='caption1' style={styles.date} color="light-gray">{formattedDate}</AppText>
                <AppText variant='subtitle1' color="white">
                    {t("Good Day")}, {user?.full_name || t("Guest")}
                </AppText>
            </View>
        );
    }

    function LocalizedSubtitle() {
        const { t } = useTranslation();
        return (
            <AppText style={styles.subtitle} variant='subtitle1' color="white">{t("TODAY SCORE")}</AppText>
        );
    }

    if (loading) {
        return (
            <>
                <LocalizedHeader />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                    <AppText variant='subtitle1' style={{ textAlign: 'center', marginBottom: 12 }} color="light-gray">
                        Loading your daily profile...
                    </AppText>
                </View>
            </>
        );
    }

    if (error) {
        return (
            <>
                <LocalizedHeader />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                    <AppText variant='subtitle1' color="primary" style={{ textAlign: 'center', marginBottom: 12 }}>
                        {"This service will be available soon."}
                    </AppText>
                    <AppText style={{ textAlign: 'center', color: COLORS.black }}>
                        {"Please check back later to access your daily profile dashboard."}
                    </AppText>
                </View>
            </>
        );
    }

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
                if (data) {
                    navigation.navigate("DailyProfileDetail", { data });
                }
            }}
            style={{ width: "100%" }}
        >
            <LocalizedHeader />
            <View style={{ width: '100%', paddingHorizontal: 12 }}>
                <AppText variant='largeTitle1' style={styles.title} color="white">{data?.today_points}%</AppText>
                <LocalizedSubtitle />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}>
                    <CircularScore value={data?.today_wealth_points} type="wealth" />
                    <CircularScore value={data?.today_study_points} type="learning" />
                    <CircularScore value={data?.today_relationship_points} type="relation" />
                    <CircularScore value={data?.today_career_points} type="career" />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: 12,
        paddingVertical: 12,
    },
    date: {
        marginBottom: 4,
    },
    title: {
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        letterSpacing: 5,
        textTransform: 'uppercase',
        marginBottom: 32
    },
    paragraph: {
        marginTop: 10,
        marginBottom: 16,
        textAlign: 'center',
    },
});

export default ProfileDashboard;
