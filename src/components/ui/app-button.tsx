import React, { Component } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { fontFamilies } from '../../constants/fonts';

type ButtonSize = 'big' | 'small';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

export interface CustomButtonProps {
  title: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export class AppButton extends Component<CustomButtonProps> {
  static defaultProps = {
    variant: 'primary',
    disabled: false,
  };

  getButtonStyle = (): ViewStyle => {
    const { variant } = this.props;

    const base: ViewStyle = {
      paddingHorizontal: 20,
      height: 47,
      width: '100%',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: COLORS.primary,
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: COLORS.black,
        };
      case 'outline':
        return {
          ...base,
          borderColor: COLORS.black,
          borderWidth: 1,
          backgroundColor: COLORS.white,
        };
      case 'text':
        return {
          ...base,
          borderColor: COLORS.black,
          borderWidth: 0,
          backgroundColor: COLORS.white,
        };
      default:
        return base;
    }
  };

  getTextStyle = (): TextStyle => {
    const { variant } = this.props;

    const base: TextStyle = {
      fontSize: 16,
      fontFamily: fontFamilies.ARCHIVO.regular,
      color: COLORS.white,
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          color: COLORS.white,
        };
      case 'text':
        return {
          ...base,
          color: COLORS.black,
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

  render() {
    const { title, onPress, disabled, style, textStyle } = this.props;

    return (
      <TouchableOpacity
        style={[this.getButtonStyle(), disabled && styles.disabled, style]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}>
        <Text style={[this.getTextStyle(), textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});
