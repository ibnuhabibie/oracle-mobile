import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Dimensions,
  Platform,
  Pressable,
  Animated,
} from 'react-native';
import { COLORS } from '../../constants/colors';

interface CenterCarouselProps<T> {
  data: T[];
  renderItem: ({ item, index, isCenter }: { item: T; index: number; isCenter: boolean }) => React.ReactElement;
  cardWidth: number;
  cardHeight: number;
  cardHeightCenter: number;
  gap?: number;
  style?: ViewStyle;
  initialIndex?: number;
  onCardPress?: (item: T) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function CenterCarousel<T>({
  data,
  renderItem,
  cardWidth,
  cardHeight,
  cardHeightCenter,
  gap = 24,
  style,
  initialIndex = 0,
  onCardPress,
}: CenterCarouselProps<T>) {
  // Infinite scroll: duplicate data at both ends
  const loopData = [...data, ...data, ...data];
  const dataLength = data.length;
  const listRef = useRef<Animated.FlatList<any>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Calculate initial scroll offset to center the first real item in the middle set
  const initialOffset =
    (dataLength + initialIndex) * (cardWidth + gap);

  // On mount, scroll to the middle set so the first real card is centered
  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollToOffset({ offset: initialOffset, animated: false });
    }, 10);
  }, [initialOffset]);

  // Handle infinite scroll by resetting offset when reaching ends
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    const leftEdge = 2 * (cardWidth + gap);
    const rightEdge = (dataLength * 2) * (cardWidth + gap);

    if (x < leftEdge) {
      listRef.current?.scrollToOffset({
        offset: x + dataLength * (cardWidth + gap),
        animated: false,
      });
    } else if (x > rightEdge) {
      listRef.current?.scrollToOffset({
        offset: x - dataLength * (cardWidth + gap),
        animated: false,
      });
    }
  };

  // Padding to show half cards on sides
  const sidePadding = (SCREEN_WIDTH - cardWidth) / 2;

  // Memoized renderItem
  const memoizedRenderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      // Animated value for this card's center
      const inputRange = [
        (index - 1) * (cardWidth + gap),
        index * (cardWidth + gap),
        (index + 1) * (cardWidth + gap),
      ];

      // Height interpolation for smooth scaling
      const animatedHeight = scrollX.interpolate({
        inputRange,
        outputRange: [cardHeight, cardHeightCenter, cardHeight],
        extrapolate: 'clamp',
      });

      const cardContent = (
        <Animated.View
          style={{
            width: cardWidth,
            marginRight: gap,
            height: animatedHeight,
            borderColor: COLORS.black,
            borderWidth: 1,
            borderRadius: 12,
            backgroundColor: 'transparent',
            // ...Platform.select({
            //   ios: {
            //     shadowOpacity: 0.12,
            //     shadowRadius: 8,
            //     shadowOffset: { width: 0, height: 2 },
            //   },
            //   android: {
            //     elevation: 4,
            //   },
            // }),
            marginVertical: 10,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 12,
              zIndex: 0,
            }}
            pointerEvents="none"
          />
          <View style={{ flex: 1, zIndex: 1 }}>
            {renderItem({ item, index: index % dataLength, isCenter: false })}
          </View>
        </Animated.View>
      );

      if (onCardPress) {
        return (
          <Pressable
            // android_ripple={{ color: COLORS.primary, borderless: false }}
            onPress={() => onCardPress(item)}
            style={{ borderRadius: 12 }}
          >
            {cardContent}
          </Pressable>
        );
      }

      return cardContent;
    },
    [cardWidth, cardHeight, cardHeightCenter, gap, renderItem, onCardPress, dataLength, sidePadding, scrollX]
  );

  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <Animated.FlatList
        ref={listRef}
        data={loopData as any}
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + gap}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: sidePadding,
        }}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        renderItem={memoizedRenderItem}
        // removeClippedSubviews={false}
        windowSize={5}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
      />
    </View>
  );
}

export default CenterCarousel;
