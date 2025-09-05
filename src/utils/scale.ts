// src/utils/scaleFont.ts
import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

// You can tune these breakpoints for your design system
const guidelineBaseWidth = 375;   // iPhone X
const guidelineBaseHeight = 812;  // iPhone X

export function scaleFont(size: number, min = 12, max = 28) {
    const scale = Math.min(width / guidelineBaseWidth, height / guidelineBaseHeight);
    const newSize = size * scale;
    const rounded = Math.round(PixelRatio.roundToNearestPixel(newSize));

    return Math.min(Math.max(rounded, min), max); // clamp between min & max
}

