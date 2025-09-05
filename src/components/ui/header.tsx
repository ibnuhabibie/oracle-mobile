import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { AppText } from './app-text';
import ArrowIcon from '../icons/arrow-icon';
import { COLORS } from '../../constants/colors';
import { fontFamilies } from '../../constants/fonts';
import { scaleFont, scaleSize } from '../../utils/scale';

type HeaderProps = {
    title: string;
    onBack: () => void;
    containerStyle?: ViewStyle;
    backButtonStyle?: ViewStyle;
    titleStyle?: TextStyle;
};

const Header: React.FC<HeaderProps> = ({
    title,
    onBack,
    containerStyle,
    backButtonStyle,
    titleStyle,
}) => (
    <View style={[styles.header, containerStyle]}>
        <Pressable onPress={onBack} style={[styles.backButton, backButtonStyle]}>
            <ArrowIcon size={scaleSize(20, 18, 28)} />
        </Pressable>
        <AppText variant="subtitle2" color="white" style={[styles.headerTitle, titleStyle]}>{title}</AppText>
    </View>
);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: scaleSize(8, 8, 12),
        paddingLeft: scaleSize(8, 8, 12),
        paddingTop: scaleSize(6, 6, 8),
    },
    backButton: {
        padding: scaleSize(6, 6, 8),
        marginLeft: scaleSize(-6, -8, 0),
    },
    headerTitle: {
        fontWeight: '600',
        marginLeft: scaleSize(12, 12, 20),
        textAlign: 'center',
        fontSize: scaleFont(16, 12, 20),
    },
});

export default Header;
