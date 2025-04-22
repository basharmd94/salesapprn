import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DollarSign, Calendar, Search, Building } from 'lucide-react-native';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import CustomerSelector from '@/components/create-order/CustomerSelector';
import { useAuth } from "@/context/AuthContext";
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from "expo-router";
import { getCustomerBalance } from '@/lib/api_customer_balance';
import { Alert, AlertText, AlertIcon } from "@/components/ui/alert";
import { InfoIcon } from "@/components/ui/icon";
import { getCustomers } from "@/database/customerModels";

export default function CustomerBalanceScreen() {
  const { user } = useAuth();
  const [zid, setZid] = useState(user?.businessId?.toString() || '');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Customer search state
  const [showCustomerSheet, setShowCustomerSheet] = useState(false);
  const [customerSearchText, setCustomerSearchText] = useState("");
  const [customers, setCustomers] = useState([]);
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
  const searchDebounceRef = useRef(null);
  const SEARCH_DELAY = 120;
  const LIMIT = 40; // Increased limit for better search results
  const mountedRef = useRef(true);

  // Format current date as YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get date from 30 days ago as YYYY-MM-DD
  const get30DaysAgoDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Initialize dates on component load
  useEffect(() => {
    setToDate(getCurrentDate());
    setFromDate(get30DaysAgoDate());
    
    // Cleanup function to handle component unmounting
    return () => {
      mountedRef.current = false;
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  // Reset customer selection when ZID changes
  useEffect(() => {
    setCustomerId('');
    setCustomerName('');
    setCustomers([]);
    setCustomerSearchText('');
  }, [zid]);

  // Customer search text side effects - memoized
  const handleCustomerSearchTextChange = useCallback(() => {
    if (customerSearchText.length < 2) {
      setCustomers([]);
    }
  }, [customerSearchText]);

  useEffect(() => {
    handleCustomerSearchTextChange();
  }, [handleCustomerSearchTextChange]);

  // Search customers function using SQLite database
  const searchCustomers = useCallback(async (searchText) => {
    if (!zid || searchText.length < 2 || !user) {
      setCustomers([]);
      return;
    }
    
    const zidInt = parseInt(zid);
    if (isNaN(zidInt) || zidInt <= 0) {
      console.error("Invalid ZID for customer search:", zid);
      setCustomers([]);
      return;
    }
    
    try {
      setCustomerSearchLoading(true);
      
      const results = await getCustomers(zidInt, searchText, user.user_id, LIMIT, 0);
      const newCustomers = results || [];
      
      if (!mountedRef.current) return;
      
      setCustomers(newCustomers);
    } catch (error) {
      console.error("Error searching customers:", error);
      if (mountedRef.current) {
        setCustomers([]);
      }
    } finally {
      if (mountedRef.current) {
        setCustomerSearchLoading(false);
      }
    }
  }, [zid, user]);

  const handleCustomerSearch = useCallback((text) => {
    setCustomerSearchText(text);
    
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (text.length >= 2) {
      searchDebounceRef.current = setTimeout(() => {
        searchCustomers(text);
      }, SEARCH_DELAY);
    } else {
      setCustomers([]);
    }
  }, [searchCustomers]);

  const handleCustomerSelect = (customer) => {
    setCustomerId(customer.xcus);
    setCustomerName(customer.xorg);
  };

  const handleZidChange = (newZid) => {
    setZid(newZid);
    // Reset customer when ZID changes
    setCustomerId('');
    setCustomerName('');
    setCustomers([]);
    setCustomerSearchText('');
  };

  const handleSubmit = async () => {
    setError('');
    
    // Validate inputs
    if (!zid) {
      setError('Please enter a Business ZID');
      return;
    }
    
    if (!customerId) {
      setError('Please select a customer');
      return;
    }
    
    if (!fromDate || !toDate) {
      setError('Please enter both from and to dates');
      return;
    }
    
    try {
      setLoading(true);
      
      // Call the API to get customer balance
      const balanceData = await getCustomerBalance(
        customerId,
        fromDate,
        toDate,
        parseInt(zid)
      );
      
      // Navigate to the details screen with the balance data
      router.push({
        pathname: '/customer-balance-details',
        params: {
          data: JSON.stringify(balanceData),
          customerName
        }
      });
      
    } catch (error) {
      console.error('Error fetching customer balance:', error);
      setError(error.message || 'Failed to fetch customer balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View 
          entering={FadeInDown.duration(500).springify()}
          className="p-4"
        >
          <VStack space="md" className="items-center mb-6">
            <DollarSign size={60} color="#2563eb" />
            <Heading size="xl" className="text-center">Customer Balance</Heading>
            <Text className="text-gray-500 text-center px-6">
              View customer balance and transaction history
            </Text>
          </VStack>
          
          <Card className="bg-white rounded-2xl p-6 mb-4">
            <VStack space="md">
              <HStack className="items-center mb-2">
                <Box className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Building size={20} color="#2563eb" />
                </Box>
                <Heading size="sm">Business Information</Heading>
              </HStack>
              
              <VStack space="xs">
                <Text className="text-gray-600 ml-1 mb-1">Business ZID</Text>
                <Input
                  size="md"
                  className="bg-gray-50 border-gray-200 rounded-xl"
                >
                  <InputField
                    placeholder="Enter Business ZID"
                    value={zid}
                    onChangeText={handleZidChange}
                    keyboardType="numeric"
                  />
                </Input>
              </VStack>
              
              <VStack space="xs">
                <Text className="text-gray-600 ml-1 mb-1">Select Customer</Text>
                <CustomerSelector
                  zid={parseInt(zid) || 0}
                  customerName={customerName}
                  disabled={!zid}
                  showCustomerSheet={showCustomerSheet}
                  setShowCustomerSheet={setShowCustomerSheet}
                  onCustomerSelect={handleCustomerSelect}
                  customers={customers}
                  loading={customerSearchLoading}
                  searchText={customerSearchText}
                  setSearchText={handleCustomerSearch}
                  onSearch={searchCustomers}
                />
              </VStack>
            </VStack>
          </Card>
          
          <Card className="bg-white rounded-2xl p-6 mb-6">
            <VStack space="md">
              <HStack className="items-center mb-2">
                <Box className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Calendar size={20} color="#2563eb" />
                </Box>
                <Heading size="sm">Date Range</Heading>
              </HStack>
              
              <VStack space="xs">
                <Text className="text-gray-600 ml-1 mb-1">From Date (YYYY-MM-DD)</Text>
                <Input
                  size="md"
                  className="bg-gray-50 border-gray-200 rounded-xl"
                >
                  <InputField
                    placeholder="YYYY-MM-DD"
                    value={fromDate}
                    onChangeText={setFromDate}
                  />
                </Input>
              </VStack>
              
              <VStack space="xs">
                <Text className="text-gray-600 ml-1 mb-1">To Date (YYYY-MM-DD)</Text>
                <Input
                  size="md"
                  className="bg-gray-50 border-gray-200 rounded-xl"
                >
                  <InputField
                    placeholder="YYYY-MM-DD"
                    value={toDate}
                    onChangeText={setToDate}
                  />
                </Input>
              </VStack>
            </VStack>
          </Card>
          
          {error ? (
            <Alert action="error" variant="solid" className="mb-4">
              <AlertIcon as={InfoIcon} />
              <AlertText>{error}</AlertText>
            </Alert>
          ) : null}
          
          <Button
            size="lg"
            variant="solid"
            className="bg-blue-600 rounded-xl"
            onPress={handleSubmit}
            disabled={loading || !zid || !customerId || !fromDate || !toDate}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <ButtonIcon as={Search} className="mr-2 text-white" />
                <ButtonText>View Balance</ButtonText>
              </>
            )}
          </Button>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}