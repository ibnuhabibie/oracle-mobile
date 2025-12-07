import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

type CoinType = 'silver' | 'gold' | 'white';

interface CoinIconProps {
  size?: number;
  type?: CoinType;
}

const CoinIcon: React.FC<CoinIconProps> = ({
  size = 18,
  type,
}) => {
  let resolvedColor = '#fff';
  if (type === 'silver') {
    resolvedColor = '#fff';
  } else if (type === 'gold') {
    resolvedColor = '#E0AE1E';
  } else if (type === 'white') {
    resolvedColor = '#FFFFFF';
  }

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 17 18"
      fill="none"
    >
      <G clipPath="url(#clip0_1263_79457)" fill={resolvedColor}>
        <Path
          fill={resolvedColor}
          d="M8.5 3.497A5.51 5.51 0 002.996 9 5.51 5.51 0 008.5 14.503 5.51 5.51 0 0014.003 9 5.51 5.51 0 008.5 3.497zM10.983 9L8.5 11.483 6.016 9 8.5 6.517 10.983 9z" />
        <Path
          fill={resolvedColor}
          d="M14.51 2.99A8.444 8.444 0 008.5.5c-2.27 0-4.405.884-6.01 2.49A8.445 8.445 0 000 9c0 2.27.884 4.405 2.49 6.01A8.445 8.445 0 008.5 17.5c2.27 0 4.405-.884 6.01-2.49A8.444 8.444 0 0017 9c0-2.27-.884-4.405-2.49-6.01zM8.5 15.5A6.507 6.507 0 012 9c0-3.584 2.916-6.5 6.5-6.5S15 5.416 15 9s-2.916 6.5-6.5 6.5z" />
      </G>
      <Defs>
        <ClipPath id="clip0_1263_79457">
          <Path fill='white' transform="translate(0 .5)" d="M0 0H17V17H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default CoinIcon;
