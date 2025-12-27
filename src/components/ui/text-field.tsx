import React, { forwardRef } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { fontFamilies } from '../../constants/fonts';
import { COLORS } from '../../constants/colors';
import { scaleFont, scaleSize } from '../../utils/scale';

type TextFieldVariant = 'default' | 'error' | 'warning' | 'disabled';

interface TextFieldProps extends TextInputProps {
  variant?: TextFieldVariant;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

const TextField = forwardRef<TextInput, TextFieldProps>(
  (
    {
      variant = 'default',
      editable = true,
      rightIcon,
      containerStyle,
      ...props
    },
    ref,
  ) => {
    const getBackgroundColor = (): string => {
      switch (variant) {
        case 'error':
          return '#FFF4F4';
        case 'warning':
          return '#FEF7EB';
        case 'disabled':
          return '#F0F0F0';
        default:
          return '#FFFFFF';
      }
    };

    return (
      <View
        style={[
          styles.container,
          { backgroundColor: getBackgroundColor() },
          containerStyle,
          props.style,
        ]}>
        <TextInput
          {...props}
          ref={ref}
          style={[styles.input, !editable && styles.disabledText]}
          editable={variant !== 'disabled'}
          placeholderTextColor="#999"
        />
        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: scaleSize(47),
    borderRadius: scaleSize(12),
    borderWidth: scaleSize(1),
    borderColor: '#6A6A6A',
    paddingHorizontal: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: scaleFont(16),
    color: COLORS.white,
    width: '100%',
    fontFamily: fontFamilies.ARCHIVO.light,
    lineHeight: scaleSize(16),
    paddingVertical: 0,
  },
  disabledText: {
    color: '#999',
  },
  icon: {
    marginLeft: scaleSize(8),
  },
});

export default TextField;
