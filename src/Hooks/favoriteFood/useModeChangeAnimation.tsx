import React, { PropsWithChildren, useMemo } from "react";
import { useRef } from "react";
import { Animated } from "react-native";

// return type
export type ModeChangeAnimationReturnType = [
  ModeAnimatedView: React.FC<React.PropsWithChildren<{}>>,
  startVibratingAnimation: () => void,
  stopVibratingAnimation: () => void,
]
export default function useModeChangeAnimation(): ModeChangeAnimationReturnType {
  const vibrationValue = useRef(new Animated.Value(0)).current;

  const startVibratingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(vibrationValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(vibrationValue, {
          toValue: -1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(vibrationValue, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: -1,
      },
    ).start();
  };

  const stopVibratingAnimation = () => {
    Animated.timing(vibrationValue, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyles = {
    transform: [
      {
        rotate: vibrationValue.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-2deg', '2deg'],
        }),
      },
    ],
  };

  type ModeAnimatedViewProps = PropsWithChildren<{}>;
  const ModeAnimatedView = useMemo(() => {
    return ({ children }: ModeAnimatedViewProps) => {
      return <Animated.View style={animatedStyles}>{children}</Animated.View>;
    };
  }, []);

  return [ModeAnimatedView, startVibratingAnimation, stopVibratingAnimation];
}