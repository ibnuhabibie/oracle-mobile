// src/utils/scale.ts
import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 375;   // base iPhone X width
const guidelineBaseHeight = 812;  // base iPhone X height

/**
 * Generic scaler for any size (margin, padding, width, height, etc.)
 */
export function scaleSize(size: number, min?: number, max?: number) {
    const scale = Math.min(width / guidelineBaseWidth, height / guidelineBaseHeight);
    const newSize = size * scale;
    const rounded = Math.round(PixelRatio.roundToNearestPixel(newSize));

    if (min !== undefined && max !== undefined) {
        return Math.min(Math.max(rounded, min), max); // clamp
    }
    return rounded;
}

/**
 * Font-specific scaler, just a wrapper of scaleSize
 */
export function scaleFont(size: number, min = 10, max = 30) {
    return scaleSize(size, min, max);
}
