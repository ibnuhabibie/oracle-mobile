import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { COLORS } from '../../../constants/colors';

const DEFAULT_COLOR = COLORS.neutral

const CartIcon: React.FC<{ size?: number, color?: string }> = ({ size = 18, color = DEFAULT_COLOR }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 17 17"
    fill="none"
  >
    <G clipPath="url(#clip0_1263_79523)">
      <Path
        fill={color}
        d="M15.642 3.218a1.995 1.995 0 00-1.535-.718H3.328L3.3 2.266A2 2 0 001.315.5h-.148a.667.667 0 100 1.333h.148a.667.667 0 01.662.589l.917 7.8a3.333 3.333 0 003.31 2.945h6.963a.667.667 0 000-1.334H6.205a2 2 0 01-1.88-1.333h7.946a3.333 3.333 0 003.281-2.742l.523-2.903a1.995 1.995 0 00-.433-1.637zm-.875 1.4l-.524 2.903a2 2 0 01-1.972 1.646H4.113l-.628-5.334h10.622a.667.667 0 01.66.786zM5.167 16.5a1.333 1.333 0 100-2.666 1.333 1.333 0 000 2.666zM11.833 16.5a1.333 1.333 0 100-2.666 1.333 1.333 0 000 2.666z" />
    </G>
    <Defs>
      <ClipPath id="clip0_1263_79523">
        <Path fill="#fff" transform="translate(.5 .5)" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default CartIcon;
