import React, { FC } from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CircularProgressBar: FC<{
  size?: number;
  strokeWidth?: number;
  text?: string;
  progress?: number;
  progressColor?: string;
  bgColor?: string;
  textColor?: string;
  showText?: boolean;
  textStyle?: TextStyle;
  textPrefix?: string;
  textSuffix?: string;
}> = ({
  size = 100,
  strokeWidth = 2,
  text,
  progress = 0,
  progressColor = '#DCBA8C',
  bgColor = '#E6E6E6',
  textColor = '#DCBA8C',
  showText = true,
  textStyle = {},
  textPrefix = '',
  textSuffix = '',
}) => {
    // Calculate values needed for the circle
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Center of the circle
    const center = size / 2;

    return (
      <View style={styles.container}>
        <Svg width={size} height={size}>
          {/* Background Circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={bgColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress Circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            transform={`rotate(90, ${center}, ${center})`} // Start from the top
          />
        </Svg>

        {showText && (
          <View style={styles.textContainer}>
            <Text style={[styles.progressText, { color: textColor }, textStyle]}>
              {textPrefix}
              {text ?? Math.round(progress)}
              {textSuffix}
            </Text>
          </View>
        )}
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CircularProgressBar;
