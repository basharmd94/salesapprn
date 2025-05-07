import React from 'react';
import { Card } from "@/components/ui/card";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Skeleton } from "@/components/ui/skeleton";
import Animated, { FadeIn } from 'react-native-reanimated';

/**
 * Skeleton loading component for customer cards
 * Updated to match ItemSkeleton style with pulse animation
 */
const CustomerSkeleton = ({ width, className = "" }) => {
  return (
    <Animated.View entering={FadeIn.duration(300).delay(100)}>
      <Card className={`mb-3 p-4 bg-white rounded-xl overflow-hidden ${className}`}>
        <VStack space="md">
          <HStack space="md" alignItems="center">
            {/* Avatar skeleton */}
            <Skeleton width={64} height={64} rounded="full" startColor="bg-orange-100" />
            
            <VStack space="sm" flex={1}>
              {/* Name skeleton */}
              <Skeleton width="90%" height={20} rounded="md" startColor="bg-orange-100" />
              
              {/* Phone/contact skeleton */}
              <Skeleton width="60%" height={16} rounded="md" startColor="bg-orange-100" />
            </VStack>
          </HStack>
          
          {/* Address skeleton */}
          <Skeleton width="100%" height={16} rounded="md" startColor="bg-orange-100" />
          
          {/* Action buttons skeleton */}
          <HStack space="sm" justifyContent="space-between">
            <Skeleton width="30%" height={32} rounded="lg" startColor="bg-orange-100" />
            <Skeleton width="30%" height={32} rounded="lg" startColor="bg-orange-100" />
            <Skeleton width="30%" height={32} rounded="lg" startColor="bg-orange-100" />
          </HStack>
        </VStack>
      </Card>
    </Animated.View>
  );
};

export default CustomerSkeleton;