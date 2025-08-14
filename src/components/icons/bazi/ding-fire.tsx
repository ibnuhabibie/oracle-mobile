import * as React from "react";
import Svg, { Path } from "react-native-svg";

const DingFire: React.FC<{ size?: number, color?: string }> = ({ size = 60, color = 'white' }) =>
(
  <Svg
    width={size}
    height={size}
    viewBox="0 0 253.000000 171.000000"
  >
    <Path
      d="M1234 1624c28-121 10-270-48-388-18-39-70-123-115-186-132-184-175-273-201-412-33-180 69-391 228-472 66-33 76-33 58 2-48 93-56 260-17 374 23 68 114 218 132 218 2 0 5-19 6-43 0-24 17-78 39-127 57-129 72-198 70-323 0-59 3-107 8-107 4 0 38 30 75 68 73 72 129 172 150 267 66 300-21 714-203 969-47 66-112 135-159 168l-30 21 7-29z"
      transform="matrix(.1 0 0 -.1 0 171)"
      fill={color}
    />
    <Path
      d="M1222 158l3-103h70v200l-38 3-38 3 3-103z"
      transform="matrix(.1 0 0 -.1 0 171)"
      fill={color}
    />
  </Svg>
)

export default DingFire
