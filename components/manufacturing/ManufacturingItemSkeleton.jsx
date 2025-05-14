import React from 'react';
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Skeleton } from "@/components/ui/skeleton";
import Animated, { FadeIn } from 'react-native-reanimated';

const ManufacturingItemSkeleton = () => {
  return (
    <Animated.View entering={FadeIn.duration(300).delay(100)}>
      <Box 
        className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
        style={{ elevation: 2 }}
      >
        <VStack space="md">
          {/* Header with MO Number and Date */}
          <HStack justifyContent="space-between" alignItems="center">
            <HStack space="sm" alignItems="center">
              <Skeleton width={36} height={36} rounded="lg" startColor="bg-orange-100" />
              <VStack>
                <Skeleton width={120} height={18} rounded="md" startColor="bg-orange-100" marginBottom={4} />
                <Skeleton width={80} height={12} rounded="md" startColor="bg-orange-100" />
              </VStack>
            </HStack>
            <Skeleton width={40} height={20} rounded="lg" startColor="bg-orange-100" />
          </HStack>
          
          {/* Item Details */}
          <VStack space="sm">
            <HStack space="sm">
              <Skeleton width={70} height={16} rounded="md" startColor="bg-orange-100" />
              <Skeleton width={120} height={16} rounded="md" startColor="bg-orange-100" />
            </HStack>
            <HStack space="sm">
              <Skeleton width={70} height={16} rounded="md" startColor="bg-orange-100" />
              <Skeleton width={180} height={16} rounded="md" startColor="bg-orange-100" />
            </HStack>
          </VStack>
          
          {/* Production Details */}
          <HStack space="lg" justifyContent="space-between" className="px-1 py-2 mt-1 bg-gray-50 rounded-lg">
            <VStack alignItems="center">
              <Skeleton width={90} height={16} rounded="md" startColor="bg-orange-100" marginBottom={4} />
              <Skeleton width={60} height={18} rounded="md" startColor="bg-orange-100" />
            </VStack>
            
            <VStack alignItems="center">
              <Skeleton width={90} height={16} rounded="md" startColor="bg-orange-100" marginBottom={4} />
              <Skeleton width={60} height={18} rounded="md" startColor="bg-orange-100" />
            </VStack>
          </HStack>
          
          {/* Last MO Details */}
          <VStack space="xs" className="mt-1 border-t border-gray-100 pt-2">
            <Skeleton width={150} height={12} rounded="md" startColor="bg-orange-100" marginBottom={4} />
            <HStack justifyContent="space-between">
              <Skeleton width={80} height={12} rounded="md" startColor="bg-orange-100" />
              <Skeleton width={60} height={12} rounded="md" startColor="bg-orange-100" />
            </HStack>
          </VStack>
          
          {/* Cost */}
          <HStack justifyContent="flex-end">
            <Skeleton width={80} height={16} rounded="md" startColor="bg-orange-100" />
          </HStack>
        </VStack>
      </Box>
    </Animated.View>
  );
};

export default ManufacturingItemSkeleton;
