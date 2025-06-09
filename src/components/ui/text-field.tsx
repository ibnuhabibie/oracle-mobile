import React, { forwardRef } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import CalendarIcon from '../icons/Calendar';
import { fontFamilies } from '../../constants/fonts';
import { COLORS } from '../../constants/colors';

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
    height: 47,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6A6A6A',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.neutral,
    width: '100%',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  disabledText: {
    color: '#999',
  },
  icon: {
    marginLeft: 8,
  },
});

export default TextField;
