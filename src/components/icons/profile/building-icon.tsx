import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { COLORS } from '../../../constants/colors';

const DEFAULT_COLOR = COLORS.neutral
const BuildingIcon: React.FC<{ size?: number, color?: string }> = ({ size = 17, color = DEFAULT_COLOR }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 17 17"
  >
    <G clipPath="url(#clip0_1263_79535)">
      <Path
        d="M5.167 9.833a.667.667 0 01-.667.667h-.667a.666.666 0 110-1.333H4.5a.667.667 0 01.667.666zm2.666-.666h-.666a.667.667 0 000 1.333h.666a.666.666 0 100-1.333zM4.5 11.833h-.667a.667.667 0 000 1.334H4.5a.667.667 0 000-1.334zm3.333 0h-.666a.667.667 0 000 1.334h.666a.667.667 0 000-1.334zm-3.333-8h-.667a.667.667 0 100 1.334H4.5a.667.667 0 100-1.334zm3.333 0h-.666a.667.667 0 000 1.334h.666a.667.667 0 000-1.334zM4.5 6.5h-.667a.667.667 0 000 1.333H4.5a.667.667 0 100-1.333zm3.333 0h-.666a.667.667 0 000 1.333h.666a.667.667 0 100-1.333zm8.667.667v6a3.337 3.337 0 01-3.333 3.333H3.833A3.337 3.337 0 01.5 13.167V3.833A3.337 3.337 0 013.833.5h4a3.337 3.337 0 013.334 3.333h2A3.337 3.337 0 0116.5 7.167zm-12.667 8h6V3.833a2 2 0 00-2-2h-4a2 2 0 00-2 2v9.334a2 2 0 002 2zm11.334-8a2 2 0 00-2-2h-2v10h2a2 2 0 002-2v-6zm-2 2a.667.667 0 100 1.333.667.667 0 000-1.333zm0 2.666a.666.666 0 100 1.333.666.666 0 000-1.333zm0-5.333a.667.667 0 100 1.333.667.667 0 000-1.333z"
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_1263_79535">
        <Path fill="#fff" transform="translate(.5 .5)" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default BuildingIcon;
