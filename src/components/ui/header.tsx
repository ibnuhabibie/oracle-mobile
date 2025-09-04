import React from 'react';
import { View, Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import ArrowIcon from '../icons/arrow-icon';
import { COLORS } from '../../constants/colors';
import { fontFamilies } from '../../constants/fonts';

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
            <ArrowIcon size={28} />
        </Pressable>
        <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
    </View>
);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 12,
        paddingLeft: 12,
        paddingTop: 8,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.white,
        marginLeft: 20,
        textAlign: 'center',
        fontFamily: fontFamilies.ARCHIVO.light,
    },
});

export default Header;
