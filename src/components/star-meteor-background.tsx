import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Animated } from 'react-native';
import RadialGradient from 'react-native-radial-gradient';
import { COLORS } from '../constants/colors';
import { useNavigationState } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// StarField component for animated stars
const NUM_STARS = 50;
const STAR_MIN_SIZE = 1;
const STAR_MAX_SIZE = 3;
const STAR_COLORS = ['#FFF8E1', '#FFE082', '#FFD700', '#FFF', '#F0EAD6'];

const getRandom = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const TWINKLE_DURATION = 1500; // ms, steady twinkle speed
const METEOR_SPEED = 5000; // ms, steady meteor speed

const StarMeteorBackground: React.FC<{ children?: React.ReactNode }> = React.memo(({ children }) => {
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

  const NUM_METEORS = 2;
  const meteors = React.useMemo(
    () =>
      Array.from({ length: NUM_METEORS }).map(() => ({
        startX: getRandom(width * 0.3, width * 0.7),
        startY: getRandom(-height * 0.05, height * 0.2),
        length: getRandom(80, 140),
        angle: getRandom(18, 28),
        anim: new Animated.Value(0),
        opacity: new Animated.Value(0),
        speed: METEOR_SPEED,
        delay: getRandom(0, 4000),
      })),
    []
  );

  const globalOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(globalOffset, {
        toValue: width + height,
        duration: 5 * 10000,
        useNativeDriver: true,
      })
    ).start();

    stars.forEach((star) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(star.twinkleAnim, {
            toValue: 0.2,
            duration: TWINKLE_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(star.twinkleAnim, {
            toValue: 1,
            duration: TWINKLE_DURATION,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    meteors.forEach((meteor) => {
      const animateMeteor = () => {
        meteor.startX = getRandom(width * 0.3, width * 0.7);
        meteor.startY = getRandom(-height * 0.05, height * 0.2);
        meteor.length = getRandom(80, 140);
        meteor.angle = getRandom(18, 28);
        meteor.speed = METEOR_SPEED;
        meteor.delay = getRandom(0, 4000);
        meteor.anim.setValue(0);
        meteor.opacity.setValue(0);
        Animated.sequence([
          Animated.delay(meteor.delay),
          Animated.parallel([
            Animated.timing(meteor.anim, {
              toValue: 1,
              duration: METEOR_SPEED,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(meteor.opacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(meteor.opacity, {
                toValue: 0,
                duration: METEOR_SPEED - 100,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]).start(() => animateMeteor());
      };
      animateMeteor();
    });
  }, [stars, globalOffset, meteors]);

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
        {meteors.map((meteor, idx) => {
          const meteorTranslate = meteor.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, width + height],
          });
          const rad = (meteor.angle * Math.PI) / 180;
          const translateX = Animated.add(
            new Animated.Value(meteor.startX),
            Animated.multiply(meteorTranslate, Math.cos(rad))
          );
          const translateY = Animated.add(
            new Animated.Value(meteor.startY),
            Animated.multiply(meteorTranslate, Math.sin(rad))
          );
          return (
            <Animated.View
              key={`meteor-${idx}`}
              style={{
                position: 'absolute',
                width: meteor.length,
                height: 1,
                borderRadius: 0.5,
                backgroundColor: COLORS.primary,
                opacity: meteor.opacity,
                transform: [
                  { translateX },
                  { translateY },
                  { rotateZ: `${meteor.angle}deg` },
                ],
                shadowColor: '#FFF',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.7,
                shadowRadius: 6,
              }}
            />
          );
        })}
        {stars.map((star, idx) => {
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
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#161C41' }]} />
      )}
      {/* Children always rendered above background and overlay */}
      {children}
    </View>
  );
});

export default StarMeteorBackground;
