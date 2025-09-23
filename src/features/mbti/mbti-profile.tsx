import React, { useState } from "react";
import { Image, StyleSheet, View, InteractionManager, ActivityIndicator } from "react-native";

import { getMbtiIconComponent } from "./mbti-profile-item";
import ShinyContainer from "../../components/widgets/shiny-container";
import { AppText } from "../../components/ui/app-text";
import { COLORS } from "../../constants/colors";
import api from "../../utils/http";
import StrengthIcon from "../../components/icons/mbti-result/strength-icon";
import WeaknessIcon from "../../components/icons/mbti-result/weakness-icon";
import RelationshipIcon from "../../components/icons/mbti-result/relationship-icon";
import CareerIcon from "../../components/icons/mbti-result/career-icon";
import { scaleFont, scaleSize } from "../../utils/scale";
import { useTranslation } from "react-i18next";

const MBTIProfile: React.FC = () => {
    const { t } = useTranslation();
    const [profile, setProfile] = useState<any>(null);
    const [ready, setReady] = useState(false);

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/v1/users/mbti-profile');
                setProfile(res.data);
                console.log(res.data);
            } catch (error) {
                console.error('Error fetching MBTI profile:', error);
            }
        };
        fetchProfile();
        InteractionManager.runAfterInteractions(() => {
            setReady(true);
        });
    }, []);

    if (!ready) {
        return <ActivityIndicator size="large" style={{ margin: 32 }} color={COLORS.primary} />;
    }

    return (
        <>
            {/* Main MBTI Type */}
            <ShinyContainer size={scaleSize(180, 100, 218)} style={{ marginBottom: scaleSize(12, 12, 16) }}>
                <AppText variant='largeTitle1' color="white">{profile?.mbti_type}</AppText>
            </ShinyContainer>

            {/* The Architect Card */}
            {
                profile?.mbti_type && (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.iconPlaceholder}>
                                {(() => {
                                    const MbtiIcon = getMbtiIconComponent(profile?.mbti_type);
                                    return MbtiIcon ? <MbtiIcon size={scaleSize(32, 28, 45)} color="white" /> : null;
                                })()}
                            </View>
                            <View style={styles.cardHeaderText}>
                                <AppText variant='title3' color="neutral">{profile?.name}</AppText>
                                <AppText variant='body1' color="neutral">{profile?.description}</AppText>
                            </View>
                        </View>
                    </View>
                )
            }

            {/* Strengths Card */}
            <View style={styles.card}>
                <ShinyContainer size={scaleSize(200, 100, 240)} style={{ marginTop: scaleSize(6, 6, 8) }}>
                    <StrengthIcon size={scaleSize(60)} />
                </ShinyContainer>
                <AppText variant='title3' color="primary">{t("strengths")}</AppText>
                <AppText variant='caption1' style={{ textAlign: 'center' }} color="neutral">
                    {profile?.strengths?.join(',')}
                </AppText>
            </View>

            {/* Weaknesses Card */}
            <View style={styles.card}>
                <ShinyContainer size={scaleSize(200, 100, 240)} style={{ marginTop: scaleSize(6, 6, 8) }}>
                    <WeaknessIcon size={scaleSize(60)} />
                </ShinyContainer>
                <AppText variant='title3' color="primary">{t("weaknesses")}</AppText>
                <AppText variant='caption1' style={{ textAlign: 'center' }} color="neutral">
                    {profile?.weaknesses?.join(',')}
                </AppText>
            </View>

            {/* Relationships Card */}
            <View style={styles.card}>
                <ShinyContainer size={scaleSize(200, 100, 240)} style={{ marginTop: scaleSize(6, 6, 8) }}>
                    <RelationshipIcon size={scaleSize(60)} />
                </ShinyContainer>
                <AppText variant='title3' color="primary">{t("relationships")}</AppText>
                <AppText variant='caption1' style={{ textAlign: 'center' }} color="neutral">
                    {profile?.relationships}
                </AppText>
            </View>

            {/* Career Card */}
            <View style={styles.card}>
                <ShinyContainer size={scaleSize(200, 100, 240)} style={{ marginTop: scaleSize(6, 6, 8) }}>
                    <CareerIcon size={scaleSize(60)} />
                </ShinyContainer>
                <AppText variant='title3' color="primary">{t("career")}</AppText>
                <AppText variant='caption1' style={{ textAlign: 'center' }} color="neutral">
                    {profile?.career}
                </AppText>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: scaleSize(8, 8, 14),
        padding: scaleSize(10, 10, 14),
        marginBottom: scaleSize(12, 12, 16),
        marginTop: scaleSize(12, 12, 16),
        gap: scaleSize(8, 8, 12),
        alignItems: 'center',
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
        width: scaleSize(48, 40, 78),
        height: scaleSize(54, 40, 84),
        borderRadius: scaleSize(6, 6, 8),
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scaleSize(8, 8, 12),
    },
});

export default MBTIProfile;
