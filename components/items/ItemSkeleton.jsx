import React from 'react';
import { Card } from "@/components/ui/card";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Reusable ItemSkeleton component for showing loading states
 * 
 * @param {Number} width - Optional width for the skeleton
 * @param {String} className - Optional additional className for styling
 */
const ItemSkeleton = ({ width, className = "" }) => {
  return (
    <Card className={`mb-3 p-4 bg-white ${className}`}>
      <VStack space="md">
        <HStack space="md">
          <Skeleton width={80} height={80} rounded="md" />
          <VStack space="sm" flex={1}>
            <Skeleton width="90%" height={20} rounded="md" />
            <Skeleton width="60%" height={20} rounded="md" />
          </VStack>
        </HStack>
        <HStack space="md" justifyContent="space-between">
          <Skeleton width="30%" height={24} rounded="md" />
          <Skeleton width="30%" height={24} rounded="md" />
        </HStack>
      </VStack>
    </Card>
  );
};

export default ItemSkeleton;