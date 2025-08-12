import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShinyContainer from '../../../components/widgets/shiny-container';
import { COLORS } from '../../../constants/colors';

type ProfileItemCardData = {
    isDark?: boolean;
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    description: string | React.ReactNode;
};

type ProfileItemCardProps = {
    data: ProfileItemCardData;
};

const ProfileItemCard: React.FC<ProfileItemCardProps> = ({ data }) => {
    // Ensure description is always an array for mapping
    const descArray = Array.isArray(data.description) ? data.description : [data.description];

    return (
        <View style={styles.card}>
            <ShinyContainer size={240}>
                {data.icon}
            </ShinyContainer>
            <Text style={styles.sectionTitle}>{data.title}</Text>
            {data.subtitle ? <Text style={styles.sectionSubtitle}>{data.subtitle}</Text> : null}
            {descArray.map((desc, idx) => (
                <Text style={styles.sectionDescription} key={idx}>
                    {desc}
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 10,
        padding: 20,
        marginBottom: 16,
        marginTop: 16,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Archivo-Light',
        color: COLORS.primary,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    sectionSubtitle: {
        fontSize: 14,
        fontFamily: 'Archivo-Light',
        color: COLORS.neutral,
        textAlign: 'center',
        marginBottom: 16,
        // fontStyle: 'italic',
    },
    sectionDescription: {
        fontSize: 14,
        fontFamily: 'Archivo-Light',
        color: COLORS.neutral,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 12,
    },
});

export default ProfileItemCard;
