import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { COLORS } from '../../../constants/colors';

const DEFAULT_COLOR = COLORS.neutral
const TermsIcon: React.FC<{ size?: number, color?: string }> = ({ size = 18, color = DEFAULT_COLOR }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 17 17"
    fill="none"
  >
    <G clipPath="url(#clip0_1263_79551)">
      <Path
        d="M13.523 2.581L12.42 1.476A3.312 3.312 0 0010.062.5H5.833A3.337 3.337 0 002.5 3.833v9.334A3.337 3.337 0 005.833 16.5h5.334a3.337 3.337 0 003.333-3.333V4.938a3.312 3.312 0 00-.977-2.357zm-.942.943c.094.094.179.198.252.31h-1.666V2.166c.111.074.215.159.31.253l1.104 1.104zm.586 9.643a2 2 0 01-2 2H5.833a2 2 0 01-2-2V3.833a2 2 0 012-2h4v2a1.333 1.333 0 001.334 1.334h2v8zm-2-6.667a.667.667 0 010 1.333H5.833a.667.667 0 010-1.333h5.334zm.666 3.333a.667.667 0 01-.666.667H5.833a.667.667 0 110-1.333h5.334a.667.667 0 01.666.666zm-.128 2.276a.666.666 0 01-.144.929 4.309 4.309 0 01-2.304.795 2.168 2.168 0 01-1.334-.466c-.218-.15-.302-.2-.466-.2a2.634 2.634 0 00-1.222.529.667.667 0 01-.809-1.059 3.908 3.908 0 012.033-.804c.444.007.874.16 1.222.437a.898.898 0 00.576.23 3.058 3.058 0 001.518-.54.666.666 0 01.93.149z"
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_1263_79551">
        <Path fill="#fff" transform="translate(.5 .5)" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default TermsIcon;
