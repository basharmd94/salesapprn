import React from 'react';
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

/**
 * Skeleton loading component for customer cards
 */
const CustomerSkeleton = () => {
  return (
    <Animated.View entering={FadeIn.duration(300).delay(100)}>
      <Card className="mb-3 p-4 bg-white rounded-xl overflow-hidden">
        <VStack space="md">
          <HStack space="md" alignItems="center">
            {/* Avatar skeleton */}
            <Box className="bg-gray-200 rounded-lg w-16 h-16 items-center justify-center" />
            
            <VStack space="xs" flex={1}>
              {/* Name skeleton */}
              <View className="h-5 bg-gray-200 rounded-md w-3/4" />
              
              {/* ID skeleton */}
              <View className="h-3 bg-gray-200 rounded-md w-1/2 mt-2" />
            </VStack>
          </HStack>
          
          {/* Tags skeleton */}
          <HStack space="sm">
            <View className="h-6 bg-gray-200 rounded-lg w-20" />
            <View className="h-6 bg-gray-200 rounded-lg w-24" />
            <View className="h-6 bg-gray-200 rounded-lg w-16" />
          </HStack>
          
          {/* Address skeleton */}
          <View className="h-4 bg-gray-200 rounded-md w-full" />
        </VStack>
      </Card>
    </Animated.View>
  );
};

export default CustomerSkeleton;