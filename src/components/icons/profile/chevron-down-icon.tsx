import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ChevronDownIcon: React.FC<{ size?: number, color?: string }> = ({ size = 12, color = '#6A6A6A' }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 9 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <Path
            d="M8.694 1.131a.625.625 0 00-.887 0L4.944 3.994a.625.625 0 01-.887 0L1.194 1.13a.625.625 0 10-.887.882L3.176 4.88a1.875 1.875 0 002.65 0l2.868-2.868a.625.625 0 000-.882z"
            fill={color}
        />
    </Svg>
)

export default ChevronDownIcon
