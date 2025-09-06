import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { COLORS } from '../../../constants/colors';

const DEFAULT_COLOR = COLORS.neutral
const ShieldIcon: React.FC<{ size?: number, color?: string }> = ({ size = 24, color = DEFAULT_COLOR }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 17 17"
    fill="none"
  >
    <G clipPath="url(#clip0_1263_79543)" fill="#D5D5D5">
      <Path
        fill={color}
        d="M12.888 1.927L8.711.534a.667.667 0 00-.421 0L4.113 1.927A3.329 3.329 0 001.834 5.09V8.5c0 5.043 6.133 7.827 6.396 7.943a.666.666 0 00.541 0c.263-.116 6.396-2.9 6.396-7.943V5.09a3.328 3.328 0 00-2.279-3.163zm.946 6.573c0 3.637-4.213 6.023-5.333 6.593-1.122-.569-5.334-2.947-5.334-6.593V5.09a2 2 0 011.368-1.898L8.501 1.87l3.965 1.322a2 2 0 011.368 1.897V8.5z" />
      <Path
        fill={color}
        d="M10.7 6.034l-2.791 2.8-1.496-1.56a.667.667 0 10-.961.924l1.537 1.6a1.249 1.249 0 00.897.4h.022a1.25 1.25 0 00.89-.37l2.848-2.847a.669.669 0 10-.946-.947z" />
    </G>
    <Defs>
      <ClipPath id="clip0_1263_79543">
        <Path fill="#fff" transform="translate(.5 .5)" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default ShieldIcon;
