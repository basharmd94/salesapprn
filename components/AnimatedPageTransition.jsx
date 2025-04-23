import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

/**
 * AnimatedPageTransition - A wrapper component that provides smooth page transitions
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered with animation
 * @param {number} props.duration - Animation duration in milliseconds (default: 300)
 * @param {number} props.delay - Animation delay in milliseconds (default: 0)
 * @param {string} props.animation - Animation type: 'fade', 'slideUp', or 'slideIn' (default: 'fade')
 * @param {object} props.style - Additional style for the container
 * @returns {React.ReactElement} Animated component
 */
const AnimatedPageTransition = ({ 
  children, 
  duration = 300, 
  delay = 0, 
  animation = 'fade',
  style = {}
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const translateX = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    const animationConfig = {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    };
    
    Animated.parallel([
      Animated.timing(opacity, animationConfig),
      Animated.timing(translateY, {
        ...animationConfig,
        toValue: 0,
      }),
      Animated.timing(translateX, {
        ...animationConfig,
        toValue: 0,
      }),
    ]).start();
    
    return () => {
      // Reset animation values when component unmounts
      opacity.setValue(0);
      translateY.setValue(20);
      translateX.setValue(20);
    };
  }, []);
  
  const getAnimationStyle = () => {
    switch (animation) {
      case 'slideUp':
        return {
          opacity,
          transform: [{ translateY }],
        };
      case 'slideIn':
        return {
          opacity,
          transform: [{ translateX }],
        };
      case 'fade':
      default:
        return {
          opacity,
        };
    }
  };
  
  return (
    <Animated.View style={[styles.container, getAnimationStyle(), style]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AnimatedPageTransition;