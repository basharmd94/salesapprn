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

  // Get stock level information based on quantity
  const getStockLevel = (stockQty) => {
    if (stockQty === 0) {
      return {
        level: 'No Stock',
        color: '#ef4444', // red-500
        textColor: 'text-red-500'
      };
    } else if (stockQty >= 1 && stockQty <= 10) {
      return {
        level: 'Low Stock',
        color: '#f59e0b', // amber-500
        textColor: 'text-amber-500'
      };
    } else if (stockQty >= 11 && stockQty <= 30) {
      return {
        level: 'Medium Stock',
        color: '#3b82f6', // blue-500
        textColor: 'text-blue-500'
      };
    } else {
      return {
        level: 'Full Stock',
        color: '#10b981', // green-500
        textColor: 'text-green-600'
      };
    }
  };

  const stockInfo = getStockLevel(item.stock);

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
                <Text className="text-orange-500 text-md font-bold">
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
                  className={`w-2 h-2 rounded-full`}
                  style={{ backgroundColor: stockInfo.color }}
                />
                <Text className={`font-medium ${stockInfo.textColor}`}>
                  {stockInfo.level}
                </Text>
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