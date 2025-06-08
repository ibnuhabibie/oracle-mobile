import React, {FC} from 'react';
import {Text, TextProps, TextStyle} from 'react-native';
import {fontFamilies} from '../../constants/fonts';

type FontWeight = 'light' | 'regular';

const CustomText: FC<TextProps & {fontWeight?: FontWeight}> = props => {
  const {style, fontWeight, ...restProps} = props;

  const combinedStyle: TextStyle | TextStyle[] = [
    {
      fontFamily: fontWeight
        ? fontFamilies.ARCHIVO[fontWeight as keyof typeof fontFamilies.ARCHIVO]
        : fontFamilies.ARCHIVO.light,
    },
    style as TextStyle,
  ];

  return <Text {...restProps} style={combinedStyle} />;
};

export {CustomText as Text};
