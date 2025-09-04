import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../components/ui/app-text';
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
            <AppText variant="subtitle2" style={styles.sectionTitle} color='primary'>{data.title}</AppText>
            {data.subtitle ? <AppText variant="caption2" style={styles.sectionSubtitle} color='neutral'>{data.subtitle}</AppText> : null}
            {descArray.map((desc, idx) => (
                <AppText variant="caption2" style={styles.sectionDescription} key={idx} color='neutral'>
                    {desc}
                </AppText>
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
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    sectionSubtitle: {
        textAlign: 'center',
        marginBottom: 16,
    },
    sectionDescription: {
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 12,
    },
});

export default ProfileItemCard;
