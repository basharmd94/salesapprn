import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { View, FlatList, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { ChevronDown, Search, X, ShoppingCart, CreditCard } from 'lucide-react-native';
import { Spinner } from '@/components/ui/spinner';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from '@/components/ui/drawer';
import { Text } from '@/components/ui/text';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { debounce } from 'lodash';

// Memoize ItemCard to prevent unnecessary re-renders
const ItemCard = memo(({ item, onSelect }) => {
  // Get stock level information based on quantity
  const getStockLevel = (stockQty) => {
    if (stockQty === 0) {
      return {
        level: 'No Stock',
        description: 'Out of stock',
        color: '#ef4444', // red-500
        textColor: 'text-red-500'
      };
    } else if (stockQty >= 1 && stockQty <= 10) {
      return {
        level: 'Low Stock',
        description: 'Urgent restock needed',
        color: '#f59e0b', // amber-500
        textColor: 'text-amber-500'
      };
    } else if (stockQty >= 11 && stockQty <= 30) {
      return {
        level: 'Medium Stock',
        description: 'Consider reordering soon',
        color: '#3b82f6', // blue-500
        textColor: 'text-blue-500'
      };
    } else {
      return {
        level: 'Full Stock',
        description: 'Well stocked',
        color: '#10b981', // green-500
        textColor: 'text-green-600'
      };
    }
  };

  const stockInfo = getStockLevel(item.stock);

  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.7}
      className="mx-4 my-2"
    >
      <View className="bg-white rounded-2xl border border-gray-200 shadow-lg p-4">
        <View className="flex-row items-center">
          <View className="bg-warning-50 p-3 rounded-xl mr-3">
            <ShoppingCart size={20} className="text-warning-500" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900" numberOfLines={1} ellipsizeMode="tail">
              {item.item_name}
            </Text>
            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-lg text-black-800 font-bold">
                ID: {item.item_id}
              </Text>
              <Text className="text-sm text-warning-500 font-medium">
                Discount: {item.min_disc_qty || ''} / ৳{item.disc_amt || ''}
              </Text>
            </View>
          </View>
        </View>

        <View className="h-px bg-gray-200 my-3" />

        <View className="flex-row justify-between mt-1">
          <View className="bg-gray-50 rounded-lg p-2 flex-1 mr-2">
            <View className="flex-row items-center">
              <View style={{ backgroundColor: stockInfo.color }} className="w-3 h-3 rounded-full mr-2" />
              <View>
                <Text className={`${stockInfo.textColor} font-medium`}>{stockInfo.level}</Text>
                <Text className="text-xs text-gray-500">{stockInfo.description}</Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center flex-1">
            <CreditCard size={16} color="#666666" />
            <Text className="ml-2 text-sm text-gray-600" numberOfLines={1} ellipsizeMode="tail">
              Price: ৳{item.std_price || 'Not available'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default function ItemSelector({
  zid,
  itemName,
  disabled,
  showItemSheet,
  setShowItemSheet,
  onItemSelect,
  items,
  loading,
  searchText,
  setSearchText,
  onSearch,
  loadingMore = false // Add a new prop for indicating when more items are being loaded
}) {
  const drawerInputRef = useRef(null);
  const [localSearchText, setLocalSearchText] = useState('');
  const initialSearchDoneRef = useRef(false);
  
  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce((text) => {
      setSearchText(text);
      if (text.length >= 2) {
        onSearch(text);
      } else {
        // Clear items when search is empty
        setSearchText('');
        onSearch('');
      }
    }, 400),
    [setSearchText, onSearch]
  );

  const handleSearchChange = useCallback((text) => {
    setLocalSearchText(text);
    debouncedSearch(text);
  }, [debouncedSearch]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.();
    };
  }, [debouncedSearch]);

  // Sync localSearchText with searchText when the drawer opens
  useEffect(() => {
    if (showItemSheet) {
      setLocalSearchText(searchText || '');
      
      // Only trigger search on initial open if searchText exists
      if (searchText?.length >= 2 && !initialSearchDoneRef.current) {
        initialSearchDoneRef.current = true;
        // Use timeout to prevent immediate search that could cause update loop
        setTimeout(() => {
          onSearch(searchText);
        }, 0);
      }
    } else {
      // Reset flag when drawer closes
      initialSearchDoneRef.current = false;
    }
  }, [showItemSheet, searchText, onSearch]);

  const handleClearSearch = useCallback(() => {
    setLocalSearchText('');
    setSearchText('');
    onSearch('');
  }, [setSearchText, onSearch]);

  const renderItem = useCallback(({ item }) => (
    <ItemCard
      item={item}
      onSelect={() => {
        onItemSelect(item);
        setShowItemSheet(false);
        Keyboard.dismiss();
      }}
    />
  ), [onItemSelect, setShowItemSheet]);

  // Updated key extractor to generate truly unique keys
  const getItemKey = useCallback((item, index) => 
    `item-${item.item_id}-${zid}-${index}`, 
  [zid]);

  // Create a loading footer component
  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    
    return (
      <View className="py-4 items-center justify-center">
        <ActivityIndicator size="small" color="#0284c7" />
        <Text className="text-gray-600 text-center mt-2">
          Loading more items...
        </Text>
      </View>
    );
  }, [loadingMore]);

  // Handle loading more items with current search term
  const handleLoadMore = useCallback(() => {
    if (items.length > 2 && !loading && !loadingMore) {
      // Make sure to use the current search text when loading more
      if (localSearchText.trim().length > 2) {
        onSearch(localSearchText);
      }
    }
  }, [items.length, loading, loadingMore, localSearchText, onSearch]);

  return (
    <VStack space="md">
      <Button
        variant="outline"
        className="border border-primary-50 rounded-2xl flex-row items-center justify-between h-10 mt-2"
        onPress={() => setShowItemSheet(true)}
        disabled={disabled}
      >
        <ButtonText className="text-primary-400 text-md font-semibold flex-1">
          {itemName || "Select Item"}
        </ButtonText>
        <ButtonIcon as={ChevronDown} className="text-primary-400" />
      </Button>

      <Drawer
        isOpen={showItemSheet}
        onClose={() => {
          setShowItemSheet(false);
          Keyboard.dismiss();
        }}
        size="full"
        anchor="bottom"
      >
        <DrawerBackdrop />
        <DrawerContent className="h-full">
          <DrawerHeader className="bg-white border-b border-gray-100">
            <View className="p-4">
              <Text className="text-xs text-gray-600 uppercase mb-1">Select Item from</Text>
              <View className="flex-row justify-between items-center">
                <Heading size="lg">Business</Heading>
                <View className="bg-orange-400 px-2 py-1 rounded-lg">
                  <Text className="text-white font-semibold">ZID {zid}</Text>
                </View>
              </View>

              <Box className="mt-4 w-[280px]">
                <View className="relative">
                  <Input
                    size="sm"
                    className="bg-white border border-gray-200 rounded-xl w-full h-14"
                  >
                    <InputField
                      ref={drawerInputRef}
                      placeholder={`Search items in ZID ${zid}...`}
                      value={localSearchText}
                      onChangeText={handleSearchChange}
                      className="text-xl font-semibold"
                      autoCorrect={false}
                      spellCheck={false}
                      autoCapitalize="none"
                      returnKeyType="search"
                    />
                    <InputSlot px="$3">
                      {localSearchText ? (
                        <TouchableOpacity 
                          onPress={handleClearSearch}
                          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        >
                          <InputIcon as={X} size={18} className="text-gray-400" />
                        </TouchableOpacity>
                      ) : (
                        <InputIcon as={Search} size={18} className="text-gray-400" />
                      )}
                    </InputSlot>
                  </Input>
                </View>
              </Box>
            </View>
          </DrawerHeader>

          <View style={{ flex: 1 }} className="bg-gray-100">
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={getItemKey}
              ListEmptyComponent={
                <View className="py-5 items-center">
                  {loading ? (
                    <View className="items-center">
                      <ActivityIndicator size="large" color="#0284c7" />
                      <Text className="text-gray-600 text-center mt-3">
                        Searching for items...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-gray-600 text-center">
                      {localSearchText.length < 1
                        ? "Type at least 1 character to search"
                        : "No items found"}
                    </Text>
                  )}
                </View>
              }
              ListFooterComponent={renderFooter}
              removeClippedSubviews={true}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={10}
              windowSize={11}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              style={{ flex: 1 }}
              contentContainerStyle={{ 
                flexGrow: items.length === 0 ? 1 : undefined,
                paddingTop: 8,
                paddingBottom: 20
              }}
              onEndReached={handleLoadMore} // Use our new handler
              onEndReachedThreshold={0.3}
            />
          </View>
        </DrawerContent>
      </Drawer>
    </VStack>
  );
}
