import { Platform, ScrollView, type ScrollViewProps } from 'react-native';
import { forwardRef } from 'react';

const SmoothScrollView = forwardRef<ScrollView, ScrollViewProps>(
  function SmoothScrollView(
    {
      showsVerticalScrollIndicator = false,
      keyboardShouldPersistTaps = 'handled',
      keyboardDismissMode = 'on-drag',
      decelerationRate = 'normal',
      scrollEventThrottle = 16,
      bounces = true,
      overScrollMode = 'never',
      removeClippedSubviews = Platform.OS === 'android',
      ...rest
    },
    ref
  ) {
    return (
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyboardDismissMode={keyboardDismissMode}
        decelerationRate={decelerationRate}
        scrollEventThrottle={scrollEventThrottle}
        bounces={bounces}
        overScrollMode={overScrollMode}
        removeClippedSubviews={removeClippedSubviews}
        {...rest}
      />
    );
  }
);

export default SmoothScrollView;
