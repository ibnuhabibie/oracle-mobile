import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../../constants/colors';

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  header?: React.ReactNode;
  floatingFooter?: React.ReactNode;
  fluid?: boolean; // If true, removes default padding
};

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  scrollable = true,
  header,
  floatingFooter,
  fluid = false,
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
    backgroundColor: COLORS.white,
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
