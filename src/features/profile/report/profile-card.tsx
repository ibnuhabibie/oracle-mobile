import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useAsyncStorage } from '../../../hooks/use-storage';
import ShinyContainer from '../../../components/widgets/ShinyContainer';
import { fontFamilies } from '../../../constants/fonts';

type UserProfile = {
    full_name?: string;
    birth_date?: Date;
    birth_time?: string;
    birth_country?: string;
    birth_city?: string;
};

type ProfileCardProps = {
    iconType: 'bazi' | 'astro';
};

const iconMap = {
    bazi: require('../../../assets/icons/bazi/header-icon.png'),
    astro: require('../../../assets/icons/astro/header-icon.png'),
};

const ProfileCard: React.FC<ProfileCardProps> = ({ iconType }) => {
    const { getUserProfile } = useAsyncStorage();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await getUserProfile();
            setProfile(data as UserProfile);
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
                <Text style={styles.infoValue}>No profile data found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.profileCard}>
            <ShinyContainer dark={false} size={160}>
                <Image source={iconMap[iconType]} />
            </ShinyContainer>

            <View style={styles.profileInfo}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Name</Text>
                    <Text style={styles.infoValue}>{profile.full_name}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Date of Birth</Text>
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
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Time of Birth</Text>
                    <Text style={styles.infoValue}>{profile.birth_time}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Country of Birth</Text>
                    <Text style={styles.infoValue}>{profile.birth_country}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>City of Birth</Text>
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
