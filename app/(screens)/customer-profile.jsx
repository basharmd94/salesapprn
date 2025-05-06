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
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Search, Users, Filter } from 'lucide-react-native';
import { COMPANY_ZIDS, COMPANY_NAMES } from '@/lib/api_items';
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Pressable } from "react-native";
import { Fab, FabIcon } from "@/components/ui/fab";
import { useAuth } from '@/context/AuthContext';
import { getCustomers } from '@/database/customerModels';

// Import our reusable components
import CustomerCard from '@/components/customers/CustomerCard';
import CustomerSkeleton from '@/components/customers/CustomerSkeleton';
// Import the centralized CompanyFilterDrawer instead of the customer-specific one
import CompanyFilterDrawer from '@/components/common/CompanyFilterDrawer';

export default function CustomerProfileScreen() {
  // Get params from route or use default (HMBR)
  const params = useLocalSearchParams();
  const defaultZid = COMPANY_ZIDS.HMBR;
  const defaultCompanyName = COMPANY_NAMES[defaultZid];
  
  const [zid, setZid] = useState(params.zid || defaultZid);
  const [companyName, setCompanyName] = useState(params.companyName || defaultCompanyName);
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.user_id;

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searching, setSearching] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const LIMIT = 20;

  // Hide the navigation header for this screen
  React.useEffect(() => {
    router.setParams({
      headerShown: false
    });
  }, [router]);

  const fetchCustomers = useCallback(async (reset = false) => {
    if (!zid || (!hasMore && !reset)) return;
    
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const newOffset = reset ? 0 : offset;
      // Use the SQLite database function to get customers
      const result = await getCustomers(zid, searchText, userId, LIMIT, newOffset);
      
      if (result && result.length > 0) {
        if (reset) {
          setCustomers(result);
        } else {
          setCustomers(prev => [...prev, ...result]);
        }
        
        setOffset(newOffset + LIMIT);
        setHasMore(result.length === LIMIT);
      } else {
        setHasMore(false);
        if (reset) {
          setCustomers([]);
        }
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [zid, searchText, offset, hasMore, userId]);

  // Initial fetch
  useEffect(() => {
    fetchCustomers(true);
  }, [zid]); // Trigger refetch when zid changes

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setOffset(0);
    setHasMore(true);
    fetchCustomers(true);
  }, [fetchCustomers]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchCustomers();
    }
  }, [loading, loadingMore, hasMore, fetchCustomers]);

  const handleSearch = useCallback(() => {
    setSearching(true);
    setOffset(0);
    setHasMore(true);
    fetchCustomers(true).finally(() => {
      setSearching(false);
    });
  }, [fetchCustomers]);

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
    setCustomers([]);
    setHasMore(true);
    // fetchCustomers will be triggered by the effect when zid changes
  }, [router]);

  const handleViewCustomerDetails = useCallback((customer) => {
    router.push({
      pathname: "/customer-balance-details",
      params: { 
        zid: customer.zid,
        xcus: customer.xcus,
        xorg: customer.xorg
      }
    });
  }, [router]);

  const renderFooter = () => {
    if (!loadingMore || customers.length === 0) return null;
    
    return (
      <Box className="py-4 items-center">
        <ActivityIndicator size="small" color="#4f46e5" />
      </Box>
    );
  };

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <VStack space="md" className="p-4">
          {[...Array(5)].map((_, index) => (
            <CustomerSkeleton key={index} />
          ))}
        </VStack>
      );
    }
    
    return (
      <Box className="py-8 items-center justify-center">
        <Users size={60} color="#d1d5db" />
        <Text className="text-gray-400 mt-4 text-center">
          No customers found. Try a different search term.
        </Text>
      </Box>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Box className="bg-white py-4 px-4 shadow-sm">
        <HStack space="md" alignItems="center">
          <Pressable onPress={() => router.back()}>
            <Box className="p-2">
              <ArrowLeft size={24} color="#374151" />
            </Box>
          </Pressable>
          <VStack>
            <Heading size="md">{companyName} Customers</Heading>
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
              placeholder="Search customers..."
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
          </Input>
          <Button 
            className="bg-indigo-600" 
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
        data={customers}
        renderItem={({ item }) => (
          <Animated.View 
            entering={FadeInRight.duration(300).delay(100)}
            className="px-4"
          >
            <CustomerCard 
              customer={item}
              onPress={() => handleViewCustomerDetails(item)}
            />
          </Animated.View>
        )}
        keyExtractor={(item, index) => `customer-${item.zid || '0'}-${item.xcus || ''}-${index}`}
        contentContainerStyle={{ paddingBottom: 80 }} // Add padding to bottom for FAB
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={["#4f46e5"]}
            tintColor="#4f46e5"
          />
        }
      />

      {/* Filter FAB */}
      <Box className="absolute bottom-6 right-6 z-50">
        <Fab
          size="lg"
          placement="bottom right"
          onPress={() => setIsFilterOpen(true)}
          className="bg-indigo-600 active:bg-indigo-700"
        >
          <FabIcon as={Filter} color="#ffffff" />
        </Fab>
      </Box>

      {/* Company Filter Drawer - Updated to use centralized component with customer-specific props */}
      <CompanyFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onSelectCompany={handleFilterSelect}
        currentZid={zid}
        title="Select Customer Company"
        subtitle="Choose a company to view its customers"
        type="customers"
      />
    </SafeAreaView>
  );
}