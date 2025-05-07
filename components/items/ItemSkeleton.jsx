import React from 'react';
import { Card } from "@/components/ui/card";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Skeleton } from "@/components/ui/skeleton";
import Animated, { FadeIn } from 'react-native-reanimated';

/**
 * Reusable ItemSkeleton component for showing loading states
 * Updated to match CustomerSkeleton with orange theme and fade animation
 * 
 * @param {Number} width - Optional width for the skeleton
 * @param {String} className - Optional additional className for styling
 */
const ItemSkeleton = ({ width, className = "" }) => {
  return (
    <Animated.View entering={FadeIn.duration(300).delay(100)}>
      <Card className={`mb-3 p-4 bg-white rounded-xl ${className}`}>
        <VStack space="md">
          <HStack space="md">
            <Skeleton width={80} height={80} rounded="md" startColor="bg-orange-100" />
            <VStack space="sm" flex={1}>
              <Skeleton width="90%" height={20} rounded="md" startColor="bg-orange-100" />
              <Skeleton width="60%" height={20} rounded="md" startColor="bg-orange-100" />
            </VStack>
          </HStack>
          <HStack space="md" justifyContent="space-between">
            <Skeleton width="30%" height={24} rounded="md" startColor="bg-orange-100" />
            <Skeleton width="30%" height={24} rounded="md" startColor="bg-orange-100" />
          </HStack>
        </VStack>
      </Card>
    </Animated.View>
  );
};

export default ItemSkeleton;