import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../components/ui/app-text';
import ShinyContainer from '../../../components/widgets/shiny-container';
import { COLORS } from '../../../constants/colors';
import { scaleFont, scaleSize } from '../../../utils/scale';

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
            <ShinyContainer size={scaleSize(200, 100, 240)}>
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
        borderRadius: scaleSize(8, 8, 14),
        padding: scaleSize(14, 14, 20),
        marginBottom: scaleSize(12, 12, 16),
        marginTop: scaleSize(12, 12, 16),
        alignItems: 'center',
    },
    sectionTitle: {
        fontWeight: '600',
        marginTop: scaleSize(12, 12, 16),
        marginBottom: scaleSize(6, 6, 8),
        textAlign: 'center',
        fontSize: scaleFont(18, 14, 22),
    },
    sectionSubtitle: {
        textAlign: 'center',
        marginBottom: scaleSize(12, 12, 16),
        fontSize: scaleFont(14, 12, 18),
    },
    sectionDescription: {
        textAlign: 'center',
        lineHeight: scaleSize(16, 16, 22),
        marginBottom: scaleSize(8, 8, 12),
        fontSize: scaleFont(12, 10, 16),
    },
});

export default ProfileItemCard;
