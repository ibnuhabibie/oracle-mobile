import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import { getMbtiIconComponent } from "./mbti-profile-item";
import ShinyContainer from "../../components/widgets/shiny-container";
import { AppText } from "../../components/ui/app-text";
import { COLORS } from "../../constants/colors";
import api from "../../utils/http";

class MBTIProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: null
        };
    }

    componentDidMount() {
        this.fetchProfile();
    }

    fetchProfile = async () => {
        try {
            const res = await api.get('/v1/users/mbti-profile');
            this.setState({ profile: res.data });
            console.log(res.data);
        } catch (error) {
            console.error('Error fetching MBTI profile:', error);
        }
    }
    render() {
        const profile = this.state.profile;

        return (
            <>
                {/* Main MBTI Type */}
                <ShinyContainer size={218} style={{ marginBottom: 16 }}>
                    <AppText color="white" style={{ fontSize: 30 }}>{profile?.mbti_type}</AppText>
                </ShinyContainer>

                {/* The Architect Card */}
                {
                    profile?.mbti_type && (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.iconPlaceholder}>
                                    {(() => {
                                        const MbtiIcon = getMbtiIconComponent(profile?.mbti_type);
                                        return MbtiIcon ? <MbtiIcon width={50} height={50} /> : null;
                                    })()}
                                </View>
                                <View style={styles.cardHeaderText}>
                                    <AppText variant='title3'>{profile?.name}</AppText>
                                    <AppText variant='body1'>{profile?.description}</AppText>
                                </View>
                            </View>
                        </View>
                    )
                }

                {/* Strengths Card */}
                <View style={styles.card}>
                    <ShinyContainer dark={false} size={240} style={{ marginTop: 8 }}>
                        <Image
                            source={require(`../../assets/icons/mbti-profile/strength.png`)}
                        />
                    </ShinyContainer>
                    <AppText variant='title3' color="primary">Strengths</AppText>
                    <AppText variant='caption1' style={{ textAlign: 'center' }}>
                        {profile?.strengths.join(',')}
                    </AppText>
                </View>

                {/* Weaknesses Card */}
                <View style={styles.card}>
                    <ShinyContainer dark={false} size={240} style={{ marginTop: 8 }}>
                        <Image
                            source={require(`../../assets/icons/mbti-profile/weakness.png`)}
                        />
                    </ShinyContainer>
                    <AppText variant='title3' color="primary">Weaknesses</AppText>
                    <AppText variant='caption1' style={{ textAlign: 'center' }}>
                        {profile?.weaknesses.join(',')}
                    </AppText>
                </View>

                {/* Relationships Card */}
                <View style={styles.card}>
                    <ShinyContainer dark={false} size={240} style={{ marginTop: 8 }}>
                        <Image
                            source={require(`../../assets/icons/mbti-profile/relationship.png`)}
                        />
                    </ShinyContainer>
                    <AppText variant='title3' color="primary">Relationships</AppText>
                    <AppText variant='caption1' style={{ textAlign: 'center' }}>
                        {profile?.relationships}
                    </AppText>
                </View>

                {/* Career Card */}
                <View style={styles.card}>
                    <ShinyContainer dark={false} size={240} style={{ marginTop: 8 }}>
                        <Image
                            source={require(`../../assets/icons/mbti-profile/career.png`)}
                        />
                    </ShinyContainer>
                    <AppText variant='title3' color="primary">Career</AppText>
                    <AppText variant='caption1' style={{ textAlign: 'center' }}>
                        {profile?.career}
                    </AppText>
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 14,
        marginBottom: 16,
        marginTop: 16,
        gap: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#6A6A6A',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    cardHeaderText: {
        flex: 1,
    },
    iconPlaceholder: {
        width: 78,
        height: 84,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
});

export default MBTIProfile
