import * as React from 'react';
import { Image, View, ViewStyle } from 'react-native';

const ShinyContainer: React.FC<{
  size?: number;
  dark?: boolean;
  style?: ViewStyle;
  children?: React.ReactNode;
}> = ({ children, style, dark = true, size = 160 }) => (
  <View style={{ ...style, position: 'relative', width: '100%', height: size }}>
    <Image
      source={
        dark
          ? require('../../assets/images/shiny/shiny-background.png')
          : require('../../assets/images/shiny/shiny-background-white.png')
      }
      style={{
        width: size,
        height: size,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        zIndex: 1,
      }}
    />
    <View
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        zIndex: 99,
      }}>
      {children}
    </View>
  </View>
);

export default ShinyContainer;
