import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { AppText } from "../../components/ui/app-text";
import WealthIcon from "../../components/icons/profile-daily/Wealth";
import LearningIcon from "../../components/icons/profile-daily/Learning";
import RelationIcon from "../../components/icons/profile-daily/Relation";
import CareerIcon from "../../components/icons/profile-daily/Career";
import { COLORS } from "../../constants/colors";
import { fontFamilies } from "../../constants/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CircularScore from "../../components/circular-score";
import api from "../../utils/http";
// import CircularProgressBar from "../../components/widgets/CircularProgressbar";

class ProfileDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            data: null
        };
    }

    async componentDidMount() {
        try {
            const userData = await AsyncStorage.getItem('user_profile');
            this.setState({ user: JSON.parse(userData || '') });
            this.fetchDailyProfile()
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    // Add this method inside the ProfileDashboard class
    async fetchDailyProfile() {
        try {
            const response = await api.get('/v1/users/daily-profile');
            this.setState({ data: response.data.content });
            console.log(response.data.content)
        } catch (error) {
            console.error('Error fetching daily profile:', error);
            return null;
        }
    }

    render() {
        const { data } = this.state
        const today_description = data?.today_description?.split('.').slice(0, 2).join('.');
        return (
            <>
                <View style={styles.header}>
                    <AppText variant='caption1' style={styles.date}>Wed, 30 Apr 2025</AppText>
                    <AppText style={styles.greeting}>
                        Good Day, {this.state.user?.full_name || 'Guest'}
                    </AppText>
                </View>
                <View style={{ width: '100%', paddingHorizontal: 12 }}>
                    <AppText style={styles.title}>{data?.today_points}%</AppText>
                    <AppText style={styles.subtitle}>TODAY SCORE</AppText>
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
        fontSize: 18,
        color: COLORS.primary,
        textAlign: 'center',
        letterSpacing: 5,
        lineHeight: 24,
        fontFamily: fontFamilies.ARCHIVO.regular,
        width: '100%',
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