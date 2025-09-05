import React, { Component } from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { fontFamilies } from '../../constants/fonts';
import { COLORS } from '../../constants/colors';
import { scaleFont } from '../../utils/scale';

type Variant = keyof typeof typographyVariants;
type Color = keyof typeof COLORS;

interface CustomTextProps extends TextProps {
  variant?: Variant;
  color?: Color;
  style?: TextStyle | TextStyle[];
}


class AppText extends Component<CustomTextProps> {

  render() {
    const {
      style,
      variant = 'body1',
      color = 'black',
      ...restProps
    } = this.props;

    const baseStyle: TextStyle = {
      ...typographyVariants[variant],
      color: COLORS[color],
    };

    const combinedStyle: TextStyle | TextStyle[] = Array.isArray(style)
      ? [baseStyle, ...style.filter(s => s !== undefined)] // Filter out any undefined elements if 'style' is an array
      : style // If 'style' is a single TextStyle object or undefined
        ? [baseStyle, style] // If it's a single TextStyle object, combine it
        : baseStyle; // If 'style' is undefined, just use baseStyle

    return <RNText {...restProps} style={combinedStyle} />;
  }
}

type VariantStyles = { [key: string]: TextStyle };

export const typographyVariants: VariantStyles = {
  display1: { fontSize: scaleFont(45), fontFamily: fontFamilies.ARCHIVO.regular },
  largeTitle1: { fontSize: scaleFont(34), fontFamily: fontFamilies.ARCHIVO.regular },
  largeTitle2: { fontSize: scaleFont(34), fontFamily: fontFamilies.ARCHIVO.light },
  title1: { fontSize: scaleFont(28), fontFamily: fontFamilies.ARCHIVO.regular },
  title2: { fontSize: scaleFont(28), fontFamily: fontFamilies.ARCHIVO.light },
  title3: { fontSize: scaleFont(22), fontFamily: fontFamilies.ARCHIVO.regular },
  title4: { fontSize: scaleFont(22), fontFamily: fontFamilies.ARCHIVO.light },
  subtitle1: { fontSize: scaleFont(18), fontFamily: fontFamilies.ARCHIVO.regular },
  subtitle2: { fontSize: scaleFont(18), fontFamily: fontFamilies.ARCHIVO.light },
  body1: { fontSize: scaleFont(16), fontFamily: fontFamilies.ARCHIVO.regular },
  body2: { fontSize: scaleFont(16), fontFamily: fontFamilies.ARCHIVO.light },
  caption1: { fontSize: scaleFont(14), fontFamily: fontFamilies.ARCHIVO.regular },
  caption2: { fontSize: scaleFont(14), fontFamily: fontFamilies.ARCHIVO.light },
  caption3: { fontSize: scaleFont(12), fontFamily: fontFamilies.ARCHIVO.regular },
  caption4: { fontSize: scaleFont(12), fontFamily: fontFamilies.ARCHIVO.light },
  tiny1: { fontSize: scaleFont(10), fontFamily: fontFamilies.ARCHIVO.regular },
  tiny2: { fontSize: scaleFont(10), fontFamily: fontFamilies.ARCHIVO.regular },
};

export { AppText };
