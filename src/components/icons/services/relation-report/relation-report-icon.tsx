import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

const RelationReportIcon: React.FC<{ size?: number, color?: string }> = ({ size = 60, color = 'white' }) =>
(
    <Svg
        width={size}
        height={size}
        viewBox="0 0 61 61"
        fill="none"
    >
        <G clipPath="url(#clip0_910_1560)">
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.877 21.265a15.149 15.149 0 014.444-10.538l-.192.192.194-.19c5.934-5.73 15.395-5.668 21.252.19l.874.873.874-.874C40.18 5.061 49.64 5 55.576 10.73l.193.19-.192-.192.19.194c5.733 5.937 5.671 15.393-.189 21.253L34.711 53.042a1.784 1.784 0 01-2.523 0l-4.689-4.691 5.262-5.262c5.042-5.042 5.055-13.22.015-18.284A12.95 12.95 0 0016.5 23.168a12.954 12.954 0 00-9.624-1.903zm23.381 6.069c-3.672-3.656-9.594-3.649-13.247.005l-.51.51-.51-.51c-3.654-3.654-9.576-3.66-13.232-.02-3.656 3.672-3.647 9.596.004 13.247L15.24 53.042a1.784 1.784 0 002.523 0l12.476-12.476c3.651-3.651 3.66-9.575.02-13.232z"
                fill={color}
            />
        </G>
        <Defs>
            <ClipPath id="clip0_910_1560">
                <Path fill="#fff" transform="translate(.02 .021)" d="M0 0H60V60H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)

export default RelationReportIcon
