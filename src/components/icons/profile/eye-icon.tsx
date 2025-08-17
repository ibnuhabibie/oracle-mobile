import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

const EyeIcon: React.FC<{ size?: number, color?: string }> = ({ size = 24, color = 'white' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 17 17"
    fill="none"
  >
    <G clipPath="url(#clip0_73_1455)" fill={color}>
      <Path d="M16.38 7.954C15.796 6.674 13.5 2.5 8.5 2.5S1.205 6.674.62 7.954a1.313 1.313 0 000 1.093C1.204 10.326 3.5 14.5 8.5 14.5s7.295-4.174 7.88-5.454a1.312 1.312 0 000-1.092zM8.5 13.167c-4.205 0-6.167-3.578-6.667-4.66.5-1.096 2.462-4.674 6.667-4.674 4.195 0 6.157 3.562 6.667 4.667-.51 1.105-2.472 4.667-6.667 4.667z" />
      <Path d="M8.5 5.167a3.333 3.333 0 100 6.667 3.333 3.333 0 000-6.667zm0 5.333a2 2 0 110-4 2 2 0 010 4z" />
    </G>
    <Defs>
      <ClipPath id="clip0_73_1455">
        <Path fill="#fff" transform="translate(.5 .5)" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default EyeIcon;
