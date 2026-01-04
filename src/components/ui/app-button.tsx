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
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../constants/colors';
import { fontFamilies } from '../../constants/fonts';
import { scaleFont, scaleSize } from '../../utils/scale';

type ButtonSize = 'big' | 'small';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

export interface CustomButtonProps {
  title: React.ReactNode | string;
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
    size: 'big'
  };

  getButtonStyle = (): ViewStyle => {
    const { variant, size } = this.props;

    const base: ViewStyle = {
      height: size === 'big' ? scaleSize(47) : scaleSize(32),
      width: '100%',
      borderRadius: scaleSize(12),
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden', // for gradient border radius
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: undefined, // background handled by gradient
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
      fontSize: size === 'big' ? scaleFont(16) : scaleFont(12),
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
    const { title, onPress, disabled, style, textStyle, loading, variant } = this.props;
    const isDisabled = disabled || loading;

    if (variant === 'primary') {
      return (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          disabled={isDisabled}
          style={{ width: '100%' }}
        >
          <LinearGradient
            colors={['#C68D14', '#F0AF24', '#C68D14']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            locations={[0, 0.476, 0.9712]}
            style={[this.getButtonStyle(), isDisabled && styles.disabled, style]}
          >
            {loading ? (
              <ActivityIndicator color={this.getTextStyle().color || COLORS.white} />
            ) : typeof title === 'string' ? (
              <Text style={[this.getTextStyle(), textStyle]}>{title}</Text>
            ) : (
              title
            )}
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[this.getButtonStyle(), isDisabled && styles.disabled, style]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={isDisabled}
      >
        {loading ? (
          <ActivityIndicator color={this.getTextStyle().color || COLORS.white} />
        ) : typeof title === 'string' ? (
          <Text style={[this.getTextStyle(), textStyle]}>{title}</Text>
        ) : (
          title
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
