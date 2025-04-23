import React, { useState } from 'react';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Package, Tag } from 'lucide-react-native';
import { ActivityIndicator, Image } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

/**
 * Reusable ItemCard component for displaying product information
 * 
 * @param {Object} item - The item object containing product information
 * @param {Function} onPress - Optional onPress handler for the card
 * @param {String} animation - Animation type ('fadeInRight', 'fadeIn', etc.)
 * @param {Boolean} showDiscount - Whether to show discount information
 */
const ItemCard = ({ 
  item, 
  onPress, 
  animation = 'fadeInRight',
  showDiscount = true 
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const AnimationComponent = animation === 'fadeInRight' ? FadeInRight : FadeInRight;

  return (
    <Animated.View entering={AnimationComponent.duration(300).springify()}>
      <Card 
        className="mb-3 p-4 bg-white rounded-xl"
        onPress={onPress}
      >
        <VStack space="md">
          <HStack space="md" alignItems="center">
            <Box className="bg-gray-100 rounded-lg w-20 h-20 items-center justify-center overflow-hidden">
              {item.xbin && !imageError ? (
                <>
                  {imageLoading && (
                    <Box className="absolute inset-0 items-center justify-center">
                      <ActivityIndicator size="small" color="#f97316" />
                    </Box>
                  )}
                  <Image
                    source={{ uri: item.xbin }}
                    style={{ width: 80, height: 80 }}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageLoading(false);
                      setImageError(true);
                    }}
                  />
                </>
              ) : (
                <Package size={32} color="#9ca3af" />
              )}
            </Box>
            <VStack space="xs" flex={1}>
              <Text className="text-gray-800 font-medium" numberOfLines={2}>
                {item.item_name}
              </Text>
              <HStack space="sm" alignItems="center">
                <Tag size={14} color="#6b7280" />
                <Text className="text-gray-500 text-sm">
                  {item.item_id}
                </Text>
              </HStack>
              <Text className="text-gray-500 text-sm">{item.item_group}</Text>
            </VStack>
          </HStack>
          
          <HStack space="md" justifyContent="space-between">
            <VStack>
              <Text className="text-gray-500 text-xs">Price</Text>
              <Text className="text-blue-600 font-bold">৳ {item.std_price}</Text>
            </VStack>
            
            <VStack>
              <Text className="text-gray-500 text-xs">Stock</Text>
              <HStack space="xs" alignItems="center">
                <Box 
                  className={`w-2 h-2 rounded-full ${
                    item.stock <= 5 ? 'bg-red-500' : 
                    item.stock <= 20 ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                />
                <Text className={`font-medium ${
                  item.stock <= 5 ? 'text-red-500' : 
                  item.stock <= 20 ? 'text-amber-500' : 'text-green-600'
                }`}>{item.stock}</Text>
              </HStack>
            </VStack>
            
            {showDiscount && item.min_disc_qty > 0 && (
              <VStack>
                <Text className="text-gray-500 text-xs">Min Qty Disc</Text>
                <Text className="text-gray-700">
                  {item.min_disc_qty} ({item.disc_amt}৳)
                </Text>
              </VStack>
            )}
          </HStack>
        </VStack>
      </Card>
    </Animated.View>
  );
};

export default ItemCard;