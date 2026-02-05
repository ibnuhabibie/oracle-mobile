import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../ui/app-text";
import { scaleFont, scaleSize } from "../../utils/scale";

// Add isLast prop
interface ProfileItemProps {
    title: string;
    icon: React.ReactNode;
    onPress: () => void;
    isLast?: boolean;
}

const ProfileItem: FC<ProfileItemProps> = ({ title, icon, onPress, isLast }) => {
    const { t } = useTranslation();

    return (
        <Pressable
            style={[
                styles.profileItem,
                isLast && { borderBottomWidth: 0 }
            ]}
            onPress={onPress}
        >
            <View style={styles.profileItemLeft}>
                {icon}
                <AppText variant="body1" style={styles.profileItemTitle} color="neutral">{t(title)}</AppText>
            </View>
            <AppText variant="subtitle1" style={styles.chevron} color="neutral">›</AppText>
        </Pressable>
    )
};


const styles = StyleSheet.create({
    profileItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: scaleSize(12, 12, 16),
        borderBottomWidth: scaleSize(1),
        borderBottomColor: '#807A6A',
    },
    profileItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileItemTitle: {
        marginLeft: scaleSize(8, 8, 12),
        fontSize: scaleFont(16, 12, 20),
    },
});

export default ProfileItem
