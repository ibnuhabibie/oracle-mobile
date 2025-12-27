import React, { useRef, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import RadialGradient from 'react-native-radial-gradient';
import { scaleSize } from '../../utils/scale';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  header?: React.ReactNode;
  floatingFooter?: React.ReactNode;
  floatingButton?: React.ReactNode; // New prop for FAB
  fluid?: boolean; // If true, removes default padding
};

const { width, height } = Dimensions.get('window');

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  scrollable = true,
  header,
  floatingFooter,
  floatingButton,
  fluid = false,
}) => {
  const content = (
    <View style={[styles.content, fluid && styles.contentFluid, style]}>
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <RadialGradient
        style={StyleSheet.absoluteFill}
        colors={['#161C41', '#161313']}
        center={[width / 2, height / 2]}
        radius={Math.max(width, height) / 1.2}
      />
      <SafeAreaView style={styles.safeArea}>
        {header && <View style={styles.fixedHeader}>{header}</View>}
        {scrollable ? (
          <ScrollView
            style={{ backgroundColor: 'transparent' }}
            contentContainerStyle={[
              styles.scrollContainer,
              { backgroundColor: 'transparent' },
            ]}
            keyboardShouldPersistTaps="handled">
            {content}
          </ScrollView>
        ) : (
          content
        )}
        {floatingFooter && (
          <View style={styles.floatingFooterContainer}>{floatingFooter}</View>
        )}
        {floatingButton && (
          <View style={styles.fabContainer}>{floatingButton}</View>
        )}
      </SafeAreaView>
    </View>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0, // Add top padding for Android
    // backgroundColor: 't',
    // You may want to add shadow or elevation here for effect
  },
  floatingFooterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#121010',
    padding: scaleSize(14),
    zIndex: 20,
    // Add shadow/elevation if needed
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: scaleSize(16),
    width: '100%',
    position: 'relative',
  },
  contentFluid: {
    padding: 0,
  },
  fabContainer: {
    position: 'absolute',
    right: scaleSize(24),
    bottom: scaleSize(36),
    zIndex: 200,
  },
});

export default ScreenContainer;
