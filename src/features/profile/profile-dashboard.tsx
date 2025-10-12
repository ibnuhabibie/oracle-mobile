import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { scaleFont, scaleSize } from "../../utils/scale";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import { AppText } from "../../components/ui/app-text";
import { COLORS } from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CircularScore from "../../components/widgets/circular-score";
import api from "../../utils/http";
import { formatDateToShortHeader } from "../../utils/date";

export interface UserProfile {
    full_name?: string;
    [key: string]: any;
}

export interface DailyProfileData {
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
    const { t } = useTranslation();

    useEffect(() => {
        const fetchUserAndProfile = async () => {
            try {
                setLoading(true);
                const userData = await AsyncStorage.getItem('user_profile');
                setUser(JSON.parse(userData || ''));
                const response = await api.get('/v1/users/daily-profile');
                console.log('response.data', response.data)
                setData(response.data.content);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(t('profileDashboard.failedToLoadUserData'));
            } finally {
                setLoading(false);
            }
        };
        fetchUserAndProfile();
    }, []);

    const today_description = data?.today_description;

    function LocalizedHeader() {
        const today = new Date();
        const formattedDate = formatDateToShortHeader(today);

        return (
            <View style={styles.header}>
                <AppText variant='caption1' style={styles.date} color="light-gray">{formattedDate}</AppText>
                <AppText variant='subtitle1' color="white">
                    {t('profileDashboard.goodDay')}, {user?.full_name || t('profileDashboard.guest')}
                </AppText>
            </View>
        );
    }

    function LocalizedSubtitle() {
        return (
            <AppText style={styles.subtitle} variant='subtitle1' color="white">{t('profileDashboard.todayScore')}</AppText>
        );
    }

    if (loading) {
        return (
            <>
                <LocalizedHeader />
                <View style={styles.centeredLoading}>
                    <AppText variant='subtitle1' style={styles.loadingText} color="light-gray">
                        {t('profileDashboard.loading')}
                    </AppText>
                </View>
            </>
        );
    }

    if (error) {
        return (
            <>
                <LocalizedHeader />
                <View style={styles.centeredLoading}>
                    <AppText variant='subtitle1' color="primary" style={styles.loadingText}>
                        {t("profileDashboard.serviceUnavailable")}
                    </AppText>
                    <AppText style={styles.errorText}>
                        {t("profileDashboard.checkBackLater")}
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
            <View style={styles.profileContent}>
                <AppText variant='largeTitle1' style={styles.title} color="white">{data?.today_points}%</AppText>
                <LocalizedSubtitle />
                <View style={styles.scoresRow}>
                    <CircularScore value={data?.today_wealth_points} type="wealth" title={t('dailyProfileDetail.wealth')} />
                    <CircularScore value={data?.today_study_points} type="learning" title={t('dailyProfileDetail.learning')} />
                    <CircularScore value={data?.today_relationship_points} type="relation" title={t('dailyProfileDetail.relation')} />
                    <CircularScore value={data?.today_career_points} type="career" title={t('dailyProfileDetail.career')} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: scaleSize(12),
        paddingVertical: scaleSize(12),
    },
    date: {
        marginBottom: scaleSize(4),
    },
    title: {
        textAlign: 'center',
        fontSize: scaleFont(34), // largeTitle1
    },
    subtitle: {
        textAlign: 'center',
        letterSpacing: scaleSize(2.5, 1, 5),
        textTransform: 'uppercase',
        marginBottom: scaleSize(32),
        fontSize: scaleFont(16, 12, 20), // subtitle1
    },
    paragraph: {
        marginTop: scaleSize(10),
        marginBottom: scaleSize(16),
        textAlign: 'center',
    },
    centeredLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: scaleSize(24),
    },
    loadingText: {
        textAlign: 'center',
        marginBottom: scaleSize(12),
        fontSize: scaleFont(16, 12, 20),
    },
    errorText: {
        textAlign: 'center',
        color: COLORS.black,
        fontSize: scaleFont(12, 10, 16),
    },
    profileContent: {
        width: '100%',
        paddingHorizontal: scaleSize(12),
    },
    scoresRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default ProfileDashboard;
