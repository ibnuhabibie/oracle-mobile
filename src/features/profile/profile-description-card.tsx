import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../../components/ui/app-text";
import { COLORS } from "../../constants/colors";

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
    return (
        <View style={styles.card}>
            <AppText variant='title4' color="primary" style={styles.header}>{data.theme}</AppText>
            <View style={styles.row}>
                <AppText variant="caption1" style={styles.label} color="neutral">{'You'}</AppText>
                <AppText variant="caption1" style={styles.value} color="neutral">{data.you}</AppText>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
                <AppText variant="caption1" style={styles.label} color="neutral">{'Him'}</AppText>
                <AppText variant="caption1" style={styles.value} color="neutral">{data.them}</AppText>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
                <AppText variant="caption1" style={styles.label} color="neutral">{'Relationship Outcome'}</AppText>
                <AppText variant="caption1" style={styles.value} color="neutral">{data.relationship_outcome}</AppText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        padding: 16,
        backgroundColor: "rgba(255,255,255,0.14)",
        marginVertical: 12,
        width: '100%'
    },
    header: {
        textAlign: "center",
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingVertical: 6,
        width: '100%'
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
        height: 1,
        backgroundColor: COLORS["dark-gray"],
        marginVertical: 2,
    },
});

export default ProfileDescriptionCard;
