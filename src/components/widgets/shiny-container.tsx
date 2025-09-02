import * as React from 'react';
import { Image, View, ViewStyle } from 'react-native';
import ShinyCircle from '../ui/shiny-circle';

const ShinyContainer: React.FC<{
  size?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}> = ({ children, style, size = 160 }) => (
  <View style={{ ...style, position: 'relative', width: '100%', height: size }}>
    <View
      style={{
        width: size,
        height: size,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        zIndex: 1,
      }}
    >
      <ShinyCircle size={size} />
    </View>
    <View
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: '-52%' }, { translateY: '-47%' }],
        zIndex: 99,
      }}>
      {children}
    </View>
  </View>
);

export default React.memo(ShinyContainer);
