import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {COLORS} from '../../constants/colors';
import {fontFamilies} from '../../constants/fonts';

type ButtonSize = 'big' | 'small';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface CustomButtonProps {
  title: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<CustomButtonProps> = ({
  title,
  size = 'big',
  variant = 'primary',
  onPress,
  disabled = false,
  style,
  textStyle,
}) => {
  const isBig = size === 'big';

  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      paddingHorizontal: 20,
      height: 47,
      width: isBig ? 327 : 234,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: COLORS.primary, // beige
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: COLORS.black, // black
        };
      case 'outline':
        return {
          ...base,
          borderColor: COLORS.black,
          borderWidth: 1,
          backgroundColor: COLORS.white,
        };
      case 'ghost':
        return {
          ...base,
          borderColor: COLORS.black,
          borderWidth: 1,
          backgroundColor: COLORS.white,
        };
      default:
        return base;
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontSize: 16,
      fontFamily: fontFamilies.ARCHIVO.regular,
    };

    switch (variant) {
      case 'primary':
      case 'ghost':
        return {
          ...base,
          color: COLORS.white,
        };
      case 'secondary':
        return {
          ...base,
          color: COLORS.white,
        };
      case 'outline':
        return {
          ...base,
          color: COLORS.black,
        };
      default:
        return base;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabled, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}>
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});
