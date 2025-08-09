import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../../constants/colors';

const DEFAULT_COLOR = COLORS.white
const CloseIcon: React.FC<{ size?: number; color?: string }> = ({
    size = 16,
    color = DEFAULT_COLOR,
}) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
    >
        <Path
            d="M8 0C3.576 0 0 3.576 0 8c0 4.424 3.576 8 8 8 4.424 0 8-3.576 8-8 0-4.424-3.576-8-8-8zm3.44 11.44a.795.795 0 01-1.128 0L8 9.128 5.688 11.44a.798.798 0 11-1.128-1.128L6.872 8 4.56 5.688A.798.798 0 115.688 4.56L8 6.872l2.312-2.312a.798.798 0 011.128 1.128L9.128 8l2.312 2.312a.812.812 0 010 1.128z"
            fill={color}
        />
    </Svg>
);

export default CloseIcon;
