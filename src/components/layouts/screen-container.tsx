import React, { useRef, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  Dimensions,
  Animated,
} from 'react-native';
import RadialGradient from 'react-native-radial-gradient';
import { COLORS } from '../../constants/colors';

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  header?: React.ReactNode;
  floatingFooter?: React.ReactNode;
  fluid?: boolean; // If true, removes default padding
  starAnimation?: boolean; // Enable animated stars
};

const { width, height } = Dimensions.get('window');

// StarField component for animated stars
const NUM_STARS = 50;
const STAR_MIN_SIZE = 2;
const STAR_MAX_SIZE = 5;
const STAR_COLORS = ['#FFF8E1', '#FFE082', '#FFD700', '#FFF', '#F0EAD6'];

const getRandom = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const StarField: React.FC = () => {
  // Each star: { left, top, size, color, twinkleAnim }
  const stars = useRef(
    Array.from({ length: NUM_STARS }).map(() => {
      const left = getRandom(0, width);
      const top = getRandom(0, height);
      const size = getRandom(STAR_MIN_SIZE, STAR_MAX_SIZE);
      const color = STAR_COLORS[Math.floor(getRandom(0, STAR_COLORS.length))];
      const twinkleAnim = new Animated.Value(getRandom(0.2, 1));
      return { left, top, size, color, twinkleAnim };
    })
  ).current;

  // Meteor logic
  const NUM_METEORS = 2;
  const meteors = useRef(
    Array.from({ length: NUM_METEORS }).map(() => ({
      startX: getRandom(width * 0.3, width * 0.7),
      startY: getRandom(-height * 0.05, height * 0.2),
      length: getRandom(80, 140),
      angle: getRandom(18, 28), // degrees, for a diagonal streak
      anim: new Animated.Value(0),
      opacity: new Animated.Value(0),
      speed: getRandom(1200, 2200),
      delay: getRandom(0, 4000),
    }))
  ).current;

  // Global offset for all stars (diagonal movement)
  const globalOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate global offset (looping)
    Animated.loop(
      Animated.timing(globalOffset, {
        toValue: width + height,
        duration: 5 * 10000,
        useNativeDriver: true,
      })
    ).start();

    // Animate twinkle for each star
    stars.forEach((star) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(star.twinkleAnim, {
            toValue: 0.2,
            duration: getRandom(1200, 2200),
            useNativeDriver: true,
          }),
          Animated.timing(star.twinkleAnim, {
            toValue: 1,
            duration: getRandom(1200, 2200),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Animate meteors
    meteors.forEach((meteor) => {
      const animateMeteor = () => {
        meteor.startX = getRandom(width * 0.3, width * 0.7);
        meteor.startY = getRandom(-height * 0.05, height * 0.2);
        meteor.length = getRandom(80, 140);
        meteor.angle = getRandom(18, 28);
        meteor.speed = getRandom(1200, 2200);
        meteor.delay = getRandom(0, 4000);
        meteor.anim.setValue(0);
        meteor.opacity.setValue(0);
        Animated.sequence([
          Animated.delay(meteor.delay),
          Animated.parallel([
            Animated.timing(meteor.anim, {
              toValue: 1,
              duration: meteor.speed,
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
                duration: meteor.speed - 100,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]).start(() => animateMeteor());
      };
      animateMeteor();
    });
  }, [stars, globalOffset, meteors]);

  // Move all stars diagonally (down-right), wrap around screen
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Meteors */}
      {meteors.map((meteor, idx) => {
        // Meteor moves diagonally down-right
        const meteorTranslate = meteor.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, width + height],
        });
        // Calculate x/y based on angle and progress
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
              backgroundColor: 'rgba(255,255,255,0.85)',
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
      {/* Stars */}
      {stars.map((star, idx) => {
        // Interpolate offset for this star (move diagonally, wrap)
        const translate = Animated.modulo(
          Animated.add(globalOffset, star.left + star.top),
          width + height
        );
        // Calculate new translateX/Y based on translate
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
  );
};

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  scrollable = true,
  header,
  floatingFooter,
  fluid = false,
  starAnimation = false,
}) => {
  const content = (
    <View
      style={[
        styles.content,
        fluid && styles.contentFluid,
        style,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Radial Gradient Background */}
      <RadialGradient
        style={StyleSheet.absoluteFill}
        colors={['#161C41', '#161313']}
        center={[width / 2, height / 2]}
        radius={Math.max(width, height) / 1.2}
      />
      {starAnimation && <StarField />}
      {header && <View style={styles.fixedHeader}>{header}</View>}
      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {floatingFooter && (
        <View style={styles.floatingFooterContainer}>{floatingFooter}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  fixedHeader: {
    width: '100%',
    zIndex: 10,
    backgroundColor: COLORS.white,
    // You may want to add shadow or elevation here for effect
  },
  floatingFooterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    padding: 12,
    zIndex: 20,
    // Add shadow/elevation if needed
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    width: '100%',
    position: 'relative',
  },
  contentFluid: {
    padding: 0,
  },
});

export default ScreenContainer;
