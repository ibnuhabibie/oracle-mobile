import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { AppText } from "../../components/ui/app-text";

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
                <Text style={styles.label}>You</Text>
                <Text style={styles.value}>{data.you}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
                <Text style={styles.label}>Him</Text>
                <Text style={styles.value}>{data.them}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
                <Text style={styles.label}>Relationship Outcome</Text>
                <Text style={styles.value}>{data.relationship_outcome}</Text>
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
    },
    label: {
        color: COLORS.neutral,
        fontSize: 14,
        fontWeight: "400",
        flex: 1.6,
    },
    value: {
        color: COLORS.neutral,
        fontSize: 14,
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
