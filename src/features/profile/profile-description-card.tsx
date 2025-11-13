import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../../components/ui/app-text";
import { COLORS } from "../../constants/colors";
import { scaleSize } from "../../utils/scale";
import { useTranslation } from 'react-i18next';

interface ProfileDescriptionCard {
    you: string;
    them: string;
    relationship_outcome: string;
    theme: string;
}

type ProfileDescriptionCardProps = {
    data: ProfileDescriptionCard
}

const ProfileDescriptionCard: React.FC<ProfileDescriptionCardProps> = ({ data }) => {
    const { t } = useTranslation();

    return (
        <View style={styles.card}>
            <AppText variant='title4' color="primary" style={styles.header}>{data.theme}</AppText>
            <View style={styles.row}>
                <AppText variant="caption1" style={styles.label} color="neutral">{t('profileDescription.you')}</AppText>
                <AppText variant="caption1" style={styles.value} color="neutral">{data.you}</AppText>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
                <AppText variant="caption1" style={styles.label} color="neutral">{t('profileDescription.him')}</AppText>
                <AppText variant="caption1" style={styles.value} color="neutral">{data.them}</AppText>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
                <AppText variant="caption1" style={styles.label} color="neutral">{t('profileDescription.relationshipOutcome')}</AppText>
                <AppText variant="caption1" style={styles.value} color="neutral">{data.relationship_outcome}</AppText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: scaleSize(8, 8, 12),
        padding: scaleSize(16, 12, 20),
        backgroundColor: "rgba(255,255,255,0.14)",
        marginVertical: scaleSize(12, 8, 16),
        width: '100%',
        flex: 1,
    },
    header: {
        textAlign: "center",
        marginBottom: scaleSize(12, 8, 16),
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingVertical: scaleSize(6, 4, 10),
        width: '100%',
    },
    label: {
        fontWeight: "400",
        flex: 1.3,
    },
    value: {
        fontWeight: "400",
        flex: 2,
    },
    separator: {
        height: scaleSize(1, 1, 2),
        backgroundColor: COLORS["dark-gray"],
        marginVertical: scaleSize(2, 1, 4),
    },
});

export default ProfileDescriptionCard;
