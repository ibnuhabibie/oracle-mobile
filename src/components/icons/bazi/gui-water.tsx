import * as React from "react";
import Svg, { Path } from "react-native-svg";

const GuiWater: React.FC<{ size?: number, color?: string }> = ({ size = 60, color = 'white' }) =>
(
  <Svg
    width={size}
    height={size}
    viewBox="0 0 205.000000 201.000000"
  >
    <Path
      d="M922 1698C483 1062 412 805 596 528c106-159 255-238 451-238 162 0 295 58 403 177 172 188 184 425 39 716-41 82-173 300-246 408-32 47-87 129-123 182s-68 97-72 97-60-78-126-172z"
      transform="matrix(.1 0 0 -.1 0 201)"
      fill={color}
    />
  </Svg>
)

export default GuiWater
