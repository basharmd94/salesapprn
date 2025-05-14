import React from 'react';
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Skeleton } from "@/components/ui/skeleton";
import Animated, { FadeIn } from 'react-native-reanimated';

const MODetailSkeleton = () => {
  return (
    <Animated.View entering={FadeIn.duration(300).delay(100)}>
      {/* Header */}
      <Box className="bg-white p-4 rounded-xl mb-4 shadow-sm">
        <HStack justifyContent="space-between" alignItems="center" className="mb-4">
          <VStack space="sm">
            <Skeleton width={180} height={24} rounded="md" startColor="bg-orange-100" />
            <Skeleton width={120} height={16} rounded="md" startColor="bg-orange-100" />
          </VStack>
          <Skeleton width={60} height={60} rounded="full" startColor="bg-orange-100" />
        </HStack>
        
        <HStack justifyContent="space-between" className="mt-2">
          <VStack space="xs">
            <Skeleton width={80} height={14} rounded="md" startColor="bg-orange-100" />
            <Skeleton width={100} height={20} rounded="md" startColor="bg-orange-100" />
          </VStack>
          <VStack space="xs">
            <Skeleton width={80} height={14} rounded="md" startColor="bg-orange-100" />
            <Skeleton width={100} height={20} rounded="md" startColor="bg-orange-100" />
          </VStack>
          <VStack space="xs">
            <Skeleton width={80} height={14} rounded="md" startColor="bg-orange-100" />
            <Skeleton width={100} height={20} rounded="md" startColor="bg-orange-100" />
          </VStack>
        </HStack>
      </Box>
      
      {/* Table Header */}
      <Box className="bg-white p-4 rounded-t-xl shadow-sm border-b border-gray-200">
        <HStack justifyContent="space-between" alignItems="center">
          <Skeleton width={100} height={16} rounded="md" startColor="bg-orange-100" />
          <Skeleton width={70} height={16} rounded="md" startColor="bg-orange-100" />
          <Skeleton width={70} height={16} rounded="md" startColor="bg-orange-100" />
          <Skeleton width={80} height={16} rounded="md" startColor="bg-orange-100" />
        </HStack>
      </Box>
      
      {/* Table Rows */}
      {[...Array(8)].map((_, index) => (
        <Box 
          key={`detail-skeleton-${index}`}
          className={`bg-white p-4 shadow-sm ${index % 2 === 1 ? 'bg-gray-50' : ''} ${index === 7 ? 'rounded-b-xl' : 'border-b border-gray-100'}`}
        >
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Skeleton width={120} height={16} rounded="md" startColor="bg-orange-100" marginBottom={2} />
              <Skeleton width={80} height={12} rounded="md" startColor="bg-orange-100" />
            </VStack>
            <Skeleton width={60} height={16} rounded="md" startColor="bg-orange-100" />
            <Skeleton width={60} height={16} rounded="md" startColor="bg-orange-100" />
            <Skeleton width={70} height={16} rounded="md" startColor="bg-orange-100" />
          </HStack>
        </Box>
      ))}
      
      {/* Summary */}
      <Box className="bg-white p-4 rounded-xl mt-4 shadow-sm">
        <HStack justifyContent="space-between" alignItems="center">
          <Skeleton width={120} height={20} rounded="md" startColor="bg-orange-100" />
          <Skeleton width={100} height={24} rounded="md" startColor="bg-orange-100" />
        </HStack>
      </Box>
    </Animated.View>
  );
};

export default MODetailSkeleton;
