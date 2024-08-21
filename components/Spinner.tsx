import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import Animated, { Easing, useSharedValue, useAnimatedProps, withRepeat, withTiming } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Spinner: React.FC = () => {
  const rotation = useSharedValue(0);

  rotation.value = withRepeat(
    withTiming(360, {
      duration: 2000,
      easing: Easing.linear,
    }),
    -1
  );

  const animatedProps = useAnimatedProps(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Svg height="100" width="100">
        <G animatedProps={animatedProps}>
          <Circle cx="50" cy="50" r="40" stroke="blue" strokeWidth="4" fill="none" />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default Spinner;