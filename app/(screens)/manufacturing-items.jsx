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
import { ArrowLeft, Search, Factory, Filter } from 'lucide-react-native';
import { get_manufacturing_items, COMPANY_ZIDS, COMPANY_NAMES } from '@/lib/api_manufacturing';
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Pressable } from "react-native";
import { Fab, FabIcon } from "@/components/ui/fab";

// Import our reusable components
import ManufacturingItemCard from '@/components/manufacturing/ManufacturingItemCard';
import ManufacturingItemSkeleton from '@/components/manufacturing/ManufacturingItemSkeleton';
import CompanyFilterDrawer from '@/components/common/CompanyFilterDrawer';

export default function ManufacturingItemsScreen() {
  // Get params from route or use default (GI Corp)
  const params = useLocalSearchParams();
  const defaultZid = COMPANY_ZIDS.GI_CORP;
  const defaultCompanyName = COMPANY_NAMES[defaultZid];
  
  const [zid, setZid] = useState(params.zid || defaultZid);
  const [companyName, setCompanyName] = useState(params.companyName || defaultCompanyName);
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searching, setSearching] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const SIZE = 10;

  // Hide the navigation header for this screen
  React.useEffect(() => {
    router.setParams({
      headerShown: false
    });
  }, [router]);

  const fetchManufacturingItems = useCallback(async (reset = false) => {
    if (!zid || (!hasMore && !reset)) return;
    
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const newPage = reset ? 1 : page;
      const result = await get_manufacturing_items(zid, {
        search_text: searchText,
        page: newPage,
        size: SIZE
      });
      
      if (result && result.items && result.items.length > 0) {
        if (reset) {
          setItems(result.items);
        } else {
          setItems(prev => [...prev, ...result.items]);
        }
        
        setPage(newPage + 1);
        setTotalPages(result.pages || 1);
        setHasMore(newPage < (result.pages || 1));
      } else {
        setHasMore(false);
        if (reset) {
          setItems([]);
        }
      }
    } catch (error) {
      console.error('Error fetching manufacturing items:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [zid, searchText, page, hasMore]);

  // Initial fetch
  useEffect(() => {
    fetchManufacturingItems(true);
  }, [zid]); // Trigger refetch when zid changes

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchManufacturingItems(true);
  }, [fetchManufacturingItems]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchManufacturingItems();
    }
  }, [loading, loadingMore, hasMore, fetchManufacturingItems]);

  const handleSearch = useCallback(() => {
    setSearching(true);
    setPage(1);
    setHasMore(true);
    fetchManufacturingItems(true).finally(() => {
      setSearching(false);
    });
  }, [fetchManufacturingItems]);

  const handleFilterSelect = useCallback((newZid, newCompanyName) => {
    // Update URL params to maintain state on refresh
    router.setParams({
      zid: newZid,
      companyName: newCompanyName
    });
    
    // Update state
    setZid(newZid);
    setCompanyName(newCompanyName);
    setPage(1);
    setItems([]);
    setHasMore(true);
    // fetchManufacturingItems will be triggered by the effect when zid changes
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
            <ManufacturingItemSkeleton key={`skeleton-${index}`} />
          ))}
        </VStack>
      );
    }
    
    return (
      <Box className="py-8 items-center justify-center">
        <Factory size={60} color="#d1d5db" />
        <Text className="text-gray-400 mt-4 text-center">
          No manufacturing items found. Try a different search term.
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
            <Heading size="md">{companyName} Manufacturing</Heading>
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
              placeholder="Search manufacturing items..."
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
        renderItem={({ item, index }) => (
          <ManufacturingItemCard item={item} index={index} />
        )}
        keyExtractor={(item) => `manufacturing-${item.zid}-${item.xmoord}`}
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
        title="Select Manufacturing Company"
        subtitle="Choose a company to view its manufacturing items"
        type="manufacturing"
      />
    </SafeAreaView>
  );
}
