import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useAsyncStorage } from '../../../hooks/use-storage';
import ShinyContainer from '../../../components/widgets/shiny-container';
import { fontFamilies } from '../../../constants/fonts';
import { useTranslation } from 'react-i18next';
import { scaleFont, scaleSize } from '../../../utils/scale';

type UserProfile = {
    full_name?: string;
    birth_date?: Date;
    birth_time?: string;
    birth_country?: string;
    birth_city?: string;
    gender?: string;
};

type ProfileCardProps = {
    iconKey: string;
    cardTitle?: string;
    profileData?: UserProfile
};

import { iconMap, ProfileIcon } from '../../../screens/main/profile/useAffinityProfile';
import { formatDateOfBirth, formatTimeOfBirth } from '../../../utils/date';
import { COLORS } from '../../../constants/colors';
import { AppText } from '../../../components/ui/app-text';
import RelationIcon from '../../../components/icons/affinity/relation-icon';

const ProfileCard: React.FC<ProfileCardProps> = ({ iconKey, cardTitle, profileData }) => {
    const { t } = useTranslation();
    const { getUserProfile } = useAsyncStorage();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (profileData) {
                console.log(profileData, 'profileData')

                setProfile({
                    full_name: profileData.full_name,
                    birth_date: profileData.birth_date,
                    birth_country: profileData.birth_country,
                    birth_city: profileData.birth_city,
                    gender: profileData.gender == 'Female' ? t('profileCard.female') : t('profileCard.male')
                })
            } else {
                const data = await getUserProfile();
                console.log(data, 'profileData');
                if (data && typeof data === 'object' && 'gender' in data) {
                    const userProfile = data as UserProfile;
                    setProfile({
                        ...userProfile,
                        gender: userProfile.gender == 'Female' ? t('profileCard.female') : t('profileCard.male')
                    });
                } else {
                    setProfile(null);
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <View style={styles.profileCard}>
                <ActivityIndicator size="large" color="#888" />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.profileCard}>
                <AppText variant="caption2" style={styles.infoValue} color='neutral'>{t('profileCard.noProfileData')}</AppText>
            </View>
        );
    }

    return (
        <View style={styles.profileCard}>
            <ShinyContainer size={scaleSize(140, 80, 160)}>
                <ProfileIcon name={iconKey} size={scaleSize(45, 28, 50)} />
            </ShinyContainer>

            {cardTitle ? <AppText variant='body1' color='primary' style={styles.cardTitle}>{cardTitle}</AppText> : null}

            <View style={styles.profileInfo}>
                <View style={styles.infoRow}>
                    <AppText variant="caption2" color='neutral'>{t('profileCard.name')}</AppText>
                    <AppText variant="caption2" style={styles.infoValue} color='neutral'>{profile.full_name}</AppText>
                </View>
                <View style={styles.infoRow}>
                    <AppText variant="caption2" color='neutral'>{t('profileCard.dateOfBirth')}</AppText>
                    <AppText variant="caption2" style={styles.infoValue} color='neutral'>
                        {profile.birth_date ? formatDateOfBirth(profile.birth_date) : ''}
                    </AppText>
                </View>
                {profile.birth_time && (
                    <View style={styles.infoRow}>
                        <AppText variant="caption2" color='neutral'>{t('profileCard.timeOfBirth')}</AppText>
                        <AppText variant="caption2" style={styles.infoValue} color='neutral'>{formatTimeOfBirth(profile.birth_time)}</AppText>
                    </View>
                )}

                <View style={styles.infoRow}>
                    <AppText variant="caption2" color='neutral'>{t('profileCard.countryOfBirth')}</AppText>
                    <AppText variant="caption2" style={styles.infoValue} color='neutral'>{profile.birth_country}</AppText>
                </View>
                <View style={styles.infoRow}>
                    <AppText variant="caption2" color='neutral'>{t('profileCard.cityOfBirth')}</AppText>
                    <AppText variant="caption2" style={styles.infoValue} color='neutral'>{profile.birth_city}</AppText>
                </View>
                <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                    <AppText variant="caption2" color='neutral'>{t('profileCard.gender')}</AppText>
                    <AppText variant="caption2" style={styles.infoValue} color='neutral'>{profile.gender}</AppText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: scaleSize(8, 8, 14),
        padding: scaleSize(14, 14, 20),
        marginTop: scaleSize(24, 24, 32),
        marginBottom: scaleSize(12, 12, 16),
        alignItems: 'center',
    },
    cardTitle: {
        marginTop: scaleSize(8, 8, 12),
        fontSize: scaleFont(16, 12, 20),
    },
    profileInfo: {
        width: '100%',
        marginTop: scaleSize(14, 14, 20),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: scaleSize(8, 8, 10),
        borderBottomWidth: scaleSize(1),
        borderBottomColor: '#5B5441',
    },
    infoValue: {
        fontWeight: '500',
        fontSize: scaleFont(14, 12, 18),
    },
});

export default ProfileCard;
