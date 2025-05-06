import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { 
  ActivityIndicator, 
  RefreshControl,
  FlatList,
  View
} from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ArrowLeft, Search, ShoppingBag, Filter } from 'lucide-react-native';
import { searchItems, COMPANY_ZIDS, COMPANY_NAMES } from '@/lib/api_items';
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Pressable } from "react-native";
import { Fab, FabIcon } from "@/components/ui/fab";

// Import our reusable components
import ItemCard from '@/components/items/ItemCard';
import ItemSkeleton from '@/components/items/ItemSkeleton';
// Import the centralized CompanyFilterDrawer from common folder
import CompanyFilterDrawer from '@/components/common/CompanyFilterDrawer';

export default function FetchItemsScreen() {
  // Get params from route or use default (HMBR)
  const params = useLocalSearchParams();
  const defaultZid = COMPANY_ZIDS.HMBR;
  const defaultCompanyName = COMPANY_NAMES[defaultZid];
  
  const [zid, setZid] = useState(params.zid || defaultZid);
  const [companyName, setCompanyName] = useState(params.companyName || defaultCompanyName);
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searching, setSearching] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const LIMIT = 10;

  // Hide the navigation header for this screen
  React.useEffect(() => {
    router.setParams({
      headerShown: false
    });
  }, [router]);

  const fetchItems = useCallback(async (reset = false) => {
    if (!zid || (!hasMore && !reset)) return;
    
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const newOffset = reset ? 0 : offset;
      const result = await searchItems(zid, searchText, LIMIT, newOffset);
      
      if (result && result.length > 0) {
        if (reset) {
          setItems(result);
        } else {
          setItems(prev => [...prev, ...result]);
        }
        
        setOffset(newOffset + LIMIT);
        setHasMore(result.length === LIMIT);
      } else {
        setHasMore(false);
        if (reset) {
          setItems([]);
        }
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [zid, searchText, offset, hasMore]);

  // Initial fetch
  useEffect(() => {
    fetchItems(true);
  }, [zid]); // Trigger refetch when zid changes

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setOffset(0);
    setHasMore(true);
    fetchItems(true);
  }, [fetchItems]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchItems();
    }
  }, [loading, loadingMore, hasMore, fetchItems]);

  const handleSearch = useCallback(() => {
    setSearching(true);
    setOffset(0);
    setHasMore(true);
    fetchItems(true).finally(() => {
      setSearching(false);
    });
  }, [fetchItems]);

  const handleFilterSelect = useCallback((newZid, newCompanyName) => {
    // Update URL params to maintain state on refresh
    router.setParams({
      zid: newZid,
      companyName: newCompanyName
    });
    
    // Update state
    setZid(newZid);
    setCompanyName(newCompanyName);
    setOffset(0);
    setItems([]);
    setHasMore(true);
    // fetchItems will be triggered by the effect when zid changes
  }, [router]);

  const renderFooter = () => {
    if (!loadingMore || items.length === 0) return null;
    
    return (
      <Box className="py-4 items-center">
        <ActivityIndicator size="small" color="#f97316" />
      </Box>
    );
  };

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <VStack space="md" className="p-4">
          {[...Array(5)].map((_, index) => (
            <ItemSkeleton key={index} />
          ))}
        </VStack>
      );
    }
    
    return (
      <Box className="py-8 items-center justify-center">
        <ShoppingBag size={60} color="#d1d5db" />
        <Text className="text-gray-400 mt-4 text-center">
          No items found. Try a different search term.
        </Text>
      </Box>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Box className="bg-white py-4 px-4 shadow-sm">
        <HStack space="md" alignItems="center">
          <Pressable onPress={() => router.back()}>
            <Box className="p-2">
              <ArrowLeft size={24} color="#374151" />
            </Box>
          </Pressable>
          <VStack>
            <Heading size="md">{companyName} Items</Heading>
            <Text className="text-gray-500">ZID: {zid}</Text>
          </VStack>
        </HStack>
      </Box>
      
      <Animated.View 
        entering={FadeInDown.duration(300)}
        className="p-4"
      >
        <HStack space="md">
          <Input className="flex-1 bg-white rounded-lg">
            <InputSlot>
              <InputIcon>
                <Search size={20} color="#9ca3af" />
              </InputIcon>
            </InputSlot>
            <InputField
              placeholder="Search items..."
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
          </Input>
          <Button 
            className="bg-orange-500" 
            onPress={handleSearch}
            isDisabled={searching}
          >
            {searching ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <ButtonText>Search</ButtonText>
            )}
          </Button>
        </HStack>
      </Animated.View>
      
      <FlatList
        data={items}
        renderItem={({ item }) => <ItemCard item={item} />}
        keyExtractor={(item) => `${item.zid}-${item.item_id}`}
        contentContainerStyle={{ padding: 16 }}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={["#f97316"]}
            tintColor="#f97316"
          />
        }
      />

      {/* Filter FAB */}
      <Fab
        size="md"
        placement="bottom right"
        onPress={() => setIsFilterOpen(true)}
        className="bg-orange-500 active:bg-orange-600 m-4"
      >
        <FabIcon as={Filter} />
      </Fab>

      {/* Company Filter Drawer */}
      <CompanyFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onSelectCompany={handleFilterSelect}
        currentZid={zid}
        title="Select Item Company"
        subtitle="Choose a company to view its inventory"
        type="items"
      />
    </SafeAreaView>
  );
}