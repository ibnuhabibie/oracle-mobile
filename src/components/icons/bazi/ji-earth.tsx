import * as React from "react";
import Svg, { Path } from "react-native-svg";

const JiEarth: React.FC<{ size?: number, color?: string }> = ({ size = 60, color = 'white' }) =>
(
  <Svg
    width={size}
    height={size}
    viewBox="0 0 205.000000 155.000000"
  >
    <Path
      d="M959 1516c-2-2-17-7-34-10-54-9-79-19-139-54-103-60-205-158-271-261-35-53-72-92-155-159C197 900 127 804 85 655c-24-85-25-90-32-186-12-174 23-268 117-316l45-22 844-1c832 0 844 0 880 21 20 11 48 36 61 56 23 34 25 45 25 162 0 107-4 137-24 196-59 172-160 331-343 541-68 77-158 181-200 231-129 153-192 183-378 183-64 0-119-2-121-4z"
      transform="matrix(.1 0 0 -.1 0 155)"
      fill={color}
    />
  </Svg>
)

export default JiEarth
