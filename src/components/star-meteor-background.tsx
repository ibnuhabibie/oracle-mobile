import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Animated } from 'react-native';
import RadialGradient from 'react-native-radial-gradient';
import { COLORS } from '../constants/colors';
import { useNavigationState } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// StarField component for animated stars
const NUM_STARS = 20;
const STAR_MIN_SIZE = 1;
const STAR_MAX_SIZE = 3;
const STAR_COLORS = ['#FFF8E1', '#FFE082', '#FFD700', '#FFF', '#F0EAD6'];

const getRandom = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const STAR_MOVING_SPEED = 230000; // ms, steady twinkle speed

type StarMeteorBackgroundProps = {
  children?: React.ReactNode;
  starAnimationActive?: boolean;
};

const StarMeteorBackground: React.FC<StarMeteorBackgroundProps> = React.memo(
  ({ children, starAnimationActive = true }) => {
    // Detect current route name using useNavigationState
    const routeName = useNavigationState((state) => {
      if (!state) return undefined;
      const route = state.routes[state.index];
      return route?.name;
    });

    // All hooks must be called unconditionally
    const stars = React.useMemo(
      () =>
        Array.from({ length: NUM_STARS }).map(() => {
          const left = getRandom(0, width);
          const top = getRandom(0, height);
          const size = getRandom(STAR_MIN_SIZE, STAR_MAX_SIZE);
          const color = STAR_COLORS[Math.floor(getRandom(0, STAR_COLORS.length))];
          const twinkleAnim = new Animated.Value(getRandom(0.2, 1));
          return { left, top, size, color, twinkleAnim };
        }),
      []
    );

    const globalOffset = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (!starAnimationActive) return;
      Animated.loop(
        Animated.timing(globalOffset, {
          toValue: width + height,
          duration: STAR_MOVING_SPEED, // 2 minutes for a full cycle
          useNativeDriver: true,
        })
      ).start();

      stars.forEach((star) => {
        const loopTwinkle = () => {
          const fadeOutDuration = getRandom(1800, 4000); // throttle: slower fade
          const fadeInDuration = getRandom(1800, 4000);  // throttle: slower fade
          const delayBefore = getRandom(500, 2000);      // throttle: longer delay
          const delayAfter = getRandom(500, 2000);       // throttle: delay after cycle
          Animated.sequence([
            Animated.delay(delayBefore),
            Animated.timing(star.twinkleAnim, {
              toValue: 0.2,
              duration: fadeOutDuration,
              useNativeDriver: true,
            }),
            Animated.timing(star.twinkleAnim, {
              toValue: 1,
              duration: fadeInDuration,
              useNativeDriver: true,
            }),
            Animated.delay(delayAfter)
          ]).start(() => {
            loopTwinkle();
          });
        };
        loopTwinkle();
      });
    }, [stars, globalOffset, starAnimationActive]);

    // Use a variable to control rendering logic
    const shouldShowPlainView = routeName === undefined || routeName === 'Welcome';

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Animated background, hidden with opacity if shouldShowPlainView */}
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { opacity: shouldShowPlainView ? 0 : 1 }
          ]}
        >
          <RadialGradient
            style={StyleSheet.absoluteFill}
            colors={['#161C41', '#161313']}
            center={[width / 2, height / 2]}
            radius={Math.max(width, height) / 1.2}
          />
          {starAnimationActive &&
            stars.map((star, idx) => {
              const translate = Animated.modulo(
                Animated.add(globalOffset, star.left + star.top),
                width + height
              );
              const translateX = Animated.modulo(Animated.add(star.left, translate), width).interpolate({
                inputRange: [0, width],
                outputRange: [0, width],
              });
              const translateY = Animated.modulo(Animated.add(star.top, translate), height).interpolate({
                inputRange: [0, height],
                outputRange: [0, height],
              });

              return (
                <Animated.View
                  key={idx}
                  style={{
                    position: 'absolute',
                    width: star.size,
                    height: star.size,
                    borderRadius: star.size / 2,
                    backgroundColor: star.color,
                    opacity: star.twinkleAnim,
                    transform: [
                      { translateX },
                      { translateY },
                    ],
                  }}
                />
              );
            })}
        </View>
        {/* Black overlay when background is hidden */}
        {shouldShowPlainView && (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: '#161313' }]} />
        )}
        {/* Children always rendered above background and overlay */}
        {children}
      </View>
    );
  }
);

export default StarMeteorBackground;
