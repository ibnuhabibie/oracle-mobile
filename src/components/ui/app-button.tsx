import React, { Component } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  ActivityIndicator,
  View,
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
  loading?: boolean;
}

export class AppButton extends Component<CustomButtonProps> {
  static defaultProps = {
    variant: 'primary',
    disabled: false,
    loading: false,
  };

  getButtonStyle = (): ViewStyle => {
    const { variant, size } = this.props;

    const base: ViewStyle = {
      paddingHorizontal: 20,
      height: size === 'big' ? 47 : 32,
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
    const { variant, size } = this.props;

    const base: TextStyle = {
      fontSize: size === 'big' ? 16 : 12,
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
    const { title, onPress, disabled, style, textStyle, loading } = this.props;
    const isDisabled = disabled || loading;

    return (
      <TouchableOpacity
        style={[this.getButtonStyle(), isDisabled && styles.disabled, style]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={isDisabled}
      >
        {loading ? (
          <ActivityIndicator color={this.getTextStyle().color || COLORS.white} />
        ) : (
          <Text style={[this.getTextStyle(), textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});
