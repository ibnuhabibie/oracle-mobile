import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../../components/ui/app-text";
import { COLORS } from "../../constants/colors";

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
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#807A6A',
    },
    profileItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileItemTitle: {
        marginLeft: 12,
    },
});

export default ProfileItem
