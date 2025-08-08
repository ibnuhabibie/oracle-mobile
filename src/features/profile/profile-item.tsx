import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
                <Text style={styles.profileItemTitle}>{t(title)}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
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
    profileItemIcon: {
        fontSize: 16,
        marginRight: 16,
        width: 20,
    },
    profileItemTitle: {
        fontSize: 16,
        color: COLORS.neutral,
        marginLeft: 12,
    },
    chevron: {
        fontSize: 18,
        color: '#CCC',
    },
});

export default ProfileItem
