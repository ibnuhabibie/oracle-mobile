import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useAsyncStorage } from '../../../hooks/use-storage';
import ShinyContainer from '../../../components/widgets/shiny-container';
import { fontFamilies } from '../../../constants/fonts';
import { useTranslation } from 'react-i18next';

type UserProfile = {
    full_name?: string;
    birth_date?: Date;
    birth_time?: string;
    birth_country?: string;
    birth_city?: string;
};

type ProfileCardProps = {
    iconKey: string;
    cardTitle?: string;
    profileData?: UserProfile
};

import { iconMap } from '../../../screens/main/profile/useAffinityProfile';

const ProfileCard: React.FC<ProfileCardProps> = ({ iconKey, cardTitle, profileData }) => {
    const { t } = useTranslation();
    const { getUserProfile } = useAsyncStorage();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(profileData, 'profileData')

        const fetchProfile = async () => {
            if (profileData) {
                setProfile({
                    full_name: profileData.name,
                    birth_date: profileData.birth_date,
                    birth_country: profileData.birth_location.split(',')[0],
                    birth_city: profileData.birth_location.split(',')[1]
                })
            } else {
                const data = await getUserProfile();
                setProfile(data as UserProfile);
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
                <Text style={styles.infoValue}>{t('profileCard.noProfileData')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.profileCard}>
            <ShinyContainer dark={false} size={160}>
                <Image
                    source={iconMap[iconKey]}
                    style={{
                        width: iconKey == 'relation' ? 40 : 80,
                        height: iconKey == 'relation' ? 40 : 80,
                        resizeMode: 'contain'
                    }} />
            </ShinyContainer>

            {cardTitle ? <Text style={styles.cardTitle}>{cardTitle}</Text> : null}

            <View style={styles.profileInfo}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('profileCard.name')}</Text>
                    <Text style={styles.infoValue}>{profile.full_name}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('profileCard.dateOfBirth')}</Text>
                    <Text style={styles.infoValue}>
                        {profile.birth_date
                            ? (profile.birth_date instanceof Date
                                ? profile.birth_date.toLocaleDateString()
                                : typeof profile.birth_date === 'string'
                                    ? profile.birth_date
                                    : '')
                            : ''}
                    </Text>
                </View>
                {
                    profile.birth_time &&
                    <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('profileCard.timeOfBirth')}</Text>
                    <Text style={styles.infoValue}>{profile.birth_time}</Text>
                    </View>
                }

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('profileCard.countryOfBirth')}</Text>
                    <Text style={styles.infoValue}>{profile.birth_country}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('profileCard.cityOfBirth')}</Text>
                    <Text style={styles.infoValue}>{profile.birth_city}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileCard: {
        backgroundColor: 'rgba(255, 200, 138, 0.22)',
        borderRadius: 10,
        padding: 20,
        marginTop: 32,
        marginBottom: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0D0C0',
    },
    cardTitle: {
        marginTop: 12
    },
    profileInfo: {
        width: '100%',
        marginTop: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#D0C0B0',
    },
    infoLabel: {
        fontSize: 14,
        fontFamily: fontFamilies.ARCHIVO.light,
        color: '#666',
    },
    infoValue: {
        fontSize: 14,
        fontFamily: fontFamilies.ARCHIVO.light,
        color: '#333',
        fontWeight: '500',
    },
});

export default ProfileCard;
