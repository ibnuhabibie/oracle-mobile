import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { COLORS } from '../../../constants/colors';

const DEFAULT_COLOR = COLORS.neutral

const EditIcon: React.FC<{ size?: number, color?: string }> = ({ size = 20, color = DEFAULT_COLOR }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 17 17"
    fill="none"
  >
    <G clipPath="url(#clip0_1263_79507)" fill={color}>
      <Path
        fill={color}
        d="M12.938 1.12L4.81 9.248a3.31 3.31 0 00-.976 2.357v.895a.667.667 0 00.667.667h.895a3.312 3.312 0 002.357-.976l8.128-8.128a2.083 2.083 0 000-2.943 2.13 2.13 0 00-2.943 0zm2 2L6.81 11.248a2.013 2.013 0 01-1.414.586h-.229v-.23c.002-.53.212-1.037.586-1.413l8.128-8.128a.765.765 0 011.057 0 .749.749 0 010 1.057z" />
      <Path
        fill={color}
        d="M15.833 6.486a.667.667 0 00-.666.667V10.5H12.5a2 2 0 00-2 2v2.667H3.833a2 2 0 01-2-2V3.833a2 2 0 012-2h6.028a.667.667 0 000-1.333H3.833A3.337 3.337 0 00.5 3.833v9.334A3.337 3.337 0 003.833 16.5h7.562a3.312 3.312 0 002.358-.976l1.77-1.772a3.314 3.314 0 00.977-2.357V7.153a.666.666 0 00-.667-.667zm-3.023 8.095a1.984 1.984 0 01-.977.534V12.5a.667.667 0 01.667-.667h2.617a2.011 2.011 0 01-.534.976l-1.773 1.772z" />
    </G>
    <Defs>
      <ClipPath id="clip0_1263_79507">
        <Path fill="#fff" transform="translate(.5 .5)" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default EditIcon;
