import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewStyle,
  Dimensions,
  TouchableOpacity,
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
  onCardPress?: (item: T, index: number, isCenter: boolean) => void;
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
  const listRef = useRef<FlatList>(null);
  const [scrollX, setScrollX] = useState(0);

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
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    setScrollX(x);

    const leftEdge = cardWidth + gap;
    const rightEdge = (dataLength * 2) * (cardWidth + gap);

    if (x < leftEdge) {
      // Scroll to the same item in the middle set
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

  return (
    <View style={[{ height: cardHeightCenter + 40, }, style]}>
      <FlatList
        ref={listRef}
        data={loopData}
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + gap}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: sidePadding,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          // Calculate the center of the screen
          const centerOfScreen = scrollX + SCREEN_WIDTH / 2;
          // Calculate the center of this card
          const cardStart = index * (cardWidth + gap) + sidePadding;
          const cardCenter = cardStart + cardWidth / 2;
          const isCenter = Math.abs(cardCenter - centerOfScreen) < (cardWidth + gap) / 2;

          const cardContent = (
            <View
              style={{
                width: cardWidth,
                marginRight: gap,
                height: isCenter ? cardHeightCenter : cardHeight,
                borderColor: COLORS.black,
                borderWidth: 1,
                borderRadius: 12,
                backgroundColor: '#fff',
                shadowOpacity: isCenter ? 0.12 : 0.06,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                marginVertical: 10,
              }}
            >
              {renderItem({ item, index: index % dataLength, isCenter })}
            </View>
          );

          if (onCardPress) {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onCardPress(item, index % dataLength, isCenter)}
              >
                {cardContent}
              </TouchableOpacity>
            );
          }

          return cardContent;
        }}
      />
    </View>
  );
}

export default CenterCarousel;
