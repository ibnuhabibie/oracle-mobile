import React from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppText } from "../../components/ui/app-text";
import { COLORS } from "../../constants/colors";
import { fontFamilies } from "../../constants/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CircularScore from "../../components/widgets/circular-score";
import api from "../../utils/http";

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

interface ProfileDashboardState {
    user: UserProfile | null;
    data: DailyProfileData | null;
    error: string | null;
    loading: boolean;
}

type ProfileDashboardProps = {};

class ProfileDashboard extends React.Component<ProfileDashboardProps, ProfileDashboardState> {
    constructor(props: ProfileDashboardProps) {
        super(props);
        this.state = {
            user: null,
            data: null,
            error: null,
            loading: false,
        };
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true });
            const userData = await AsyncStorage.getItem('user_profile');
            this.setState({ user: JSON.parse(userData || '') });
            await this.fetchDailyProfile();
        } catch (error) {
            console.error('Error fetching user data:', error);
            this.setState({ error: 'Failed to load user data. Please try again later.' });
        } finally {
            this.setState({ loading: false });
        }
    }

    async fetchDailyProfile() {
        try {
            this.setState({ loading: true });
            const response = await api.get('/v1/users/daily-profile');
            this.setState({ data: response.data.content });
        } catch (error) {
            console.error('Error fetching daily profile:', error);
            this.setState({ error: 'Failed to load daily profile. Please check your connection and try again.' });
            return null;
        } finally {
            this.setState({ loading: false });
        }
    }

    render() {
        const { data, user, error, loading } = this.state;
        const today_description = data?.today_description?.split('.').slice(0, 2).join('.');

        if (loading) {
            return (
                <>
                    <LocalizedHeader />
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                        <AppText style={{ color: COLORS.primary, fontSize: 18, textAlign: 'center', marginBottom: 12 }}>
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
                        <AppText style={{ color: COLORS.primary, fontSize: 18, textAlign: 'center', marginBottom: 12 }}>
                            {"This service will be available soon."}
                        </AppText>
                        <AppText style={{ textAlign: 'center', color: COLORS.black }}>
                            {"Please check back later to access your daily profile dashboard."}
                        </AppText>
                    </View>
                </>
            );
        }

        // i18n
        // Use hook in a functional wrapper
        function LocalizedHeader() {
            const { t, i18n } = useTranslation();

            // Localized date
            const today = new Date();
            const locale = i18n.language || "en";
            const formattedDate = today.toLocaleDateString(locale, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric"
            });

            return (
                <View style={styles.header}>
                    <AppText variant='caption1' style={styles.date}>{formattedDate}</AppText>
                    <AppText style={styles.greeting}>
                        {t("Good Day")}, {user?.full_name || t("Guest")}
                    </AppText>
                </View>
            );
        }

        function LocalizedSubtitle() {
            const { t } = useTranslation();
            return (
                <AppText style={styles.subtitle} variant='subtitle1' color="primary">{t("TODAY SCORE")}</AppText>
            );
        }

        return (
            <>
                <LocalizedHeader />
                <View style={{ width: '100%', paddingHorizontal: 12 }}>
                    <AppText style={styles.title}>{data?.today_points}%</AppText>
                    <LocalizedSubtitle />
                    <AppText variant='caption1' color="neutral" style={styles.paragraph}>
                        {today_description}
                    </AppText>
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
            </>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        marginBottom: 26,
        paddingVertical: 12,
    },
    date: {
        color: '#B0B0B0',
        marginBottom: 4,
    },
    greeting: {
        fontSize: 18,
        color: COLORS.black,
    },
    title: {
        fontSize: 40,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        letterSpacing: 5,
        textTransform: 'uppercase'
    },
    paragraph: {
        marginTop: 10,
        marginBottom: 16,
        textAlign: 'center',
    },
    aspectText: {
        fontSize: 16,
        color: COLORS.primary,
        marginTop: 8,
    },
});


export default ProfileDashboard
