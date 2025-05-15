import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl, Linking, Platform, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clipboard, Calendar, User, Briefcase, Factory, Download, ArrowLeft } from "lucide-react-native";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { get_manufacturing_item_details } from '@/lib/api_manufacturing';
import { MODetailSkeleton } from '@/components/manufacturing';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function MODetailScreen() {
  const { zid, moNumber, xitem, xdesc, xqtyprd } = useLocalSearchParams();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  // Fetch detail data
  const fetchDetailData = async () => {
    try {
      setLoading(true);
      const response = await get_manufacturing_item_details(
        zid,
        moNumber
      );
      // Check if we received data in the expected format
      if (Array.isArray(response) && response.length > 0) {
        // Store the components directly
        setDetailData(response);
      } else {
        console.error('Unexpected data format received:', response);
        setDetailData(null);
      }
    } catch (error) {
      console.error('Error fetching MO details:', error);
      setDetailData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (moNumber && zid) {
      fetchDetailData();
    }
  }, [moNumber, zid]);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchDetailData();
  };

  // Format date string to display as DD MMM YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Go back to list
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-100">
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with back button and export */}
        <HStack justifyContent="space-between" className="mb-4">
          <Button
            size="sm"
            variant="outline"
            onPress={handleBack}
            className="border-gray-300"
          >
            <ArrowLeft size={16} color="#6b7280" />
          <Text>Back</Text>
          </Button>
        </HStack>
          {loading ? (
          <MODetailSkeleton />
        ) : detailData ? (
          <Animated.View entering={FadeIn.duration(300)}>
            {/* MO Summary Card */}
            <Box className="bg-white p-4 rounded-xl mb-4 shadow-sm">
              <HStack justifyContent="space-between" alignItems="flex-start" className="mb-3">
                <VStack>
                  <HStack space="sm" alignItems="center">
                    <Box className="bg-secondary-400 p-2 rounded-lg">
                      <Clipboard size={20} color="#f97316" />
                    </Box>
                    <VStack>
                      <Text className="text-xl font-bold text-gray-800">MO #{moNumber}</Text>
                      {xitem && <Text className="text-sm text-gray-600">{xitem}</Text>}
                    </VStack>
                  </HStack>
                </VStack>
              </HStack>
                {/* Summary information */}
              <VStack space="sm" className="mb-3">             

                {/* Item Code */}
                <HStack space="sm">
                  <Text className="text-gray-600 w-32">Item Code:</Text>
                  <Text className="flex-1 font-medium text-gray-800">{xitem || (moNumber && moNumber.substring(0, 8)) || 'N/A'}</Text>
                </HStack>
                
                {/* Description */}
                <HStack space="sm">
                  <Text className="text-gray-600 w-32">Description:</Text>
                  <Text className="flex-1 font-medium text-gray-800">{xdesc || 'Finished Goods'}</Text>
                </HStack>
                
                {/* Production Quantity */}
                <HStack space="sm">
                  <Text className="text-gray-600 w-32">Production Qty:</Text>
                  <Text className="flex-1 font-medium text-blue-600">
                    {/* Show production quantity if it's available in the first item */}
                    {xqtyprd || 'N/A'}
                  </Text>
                </HStack>
                
                {/* Unit Cost */}
                <HStack space="sm">
                  <Text className="text-gray-600 w-32">Unit Cost:</Text>
                  <Text className="flex-1 font-medium text-gray-800">
                    ৳{detailData.reduce((sum, item) => sum + (item.cost_per_item || 0), 0).toFixed(2)}
                  </Text>
                </HStack>
                
                {/* Calculate total cost */}
                <HStack space="sm">
                  <Text className="text-gray-600 w-32">Total Cost:</Text>
                  <Text className="flex-1 font-semibold text-orange-600">
                    ৳{detailData.reduce((sum, item) => sum + (item.total_amt || 0), 0).toFixed(2)}
                  </Text>
                </HStack>
              </VStack>
            </Box>
            
            {/* Components List */}
            <Text className="text-lg font-bold mb-2">Components</Text>
            <Box className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
              {/* Table Header */}
              <HStack className="bg-gray-50 p-3 border-b border-gray-200">
                <Text className="flex-1 font-medium text-gray-700">Item</Text>
                <Text className="w-16 text-right font-medium text-gray-700">Qty</Text>
                <Text className="w-16 text-right font-medium text-gray-700">Unit</Text>
                <Text className="w-20 text-right font-medium text-gray-700">Cost</Text>
              </HStack>
              
              {/* Table Body */}
              {detailData.map((component, index) => (                <HStack 
                  key={`component-${index}`}
                  className={`p-3 ${index % 2 === 1 ? 'bg-gray-50' : ''} ${
                    index !== detailData.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                  alignItems="center"
                >
                  <VStack className="flex-1">                    <Text className="text-gray-800 font-medium">{component.xitem}</Text>
                    <Text className="text-sm text-gray-500">{component.xdesc}</Text>
                    <HStack space="sm" className="mt-1">                      <Text className="text-sm text-blue-600">Rate: ৳{component.rate?.toFixed(2) || '0.00'}</Text>
                      <Text className="text-sm text-gray-800">Unit Cost: ৳{component.cost_per_item?.toFixed(2) || '0.00'}</Text>
                      <Text 
                        className={`text-sm ${
                          component.stock === 0 ? 'text-red-600' : 
                          component.stock < 20 ? 'text-orange-600' : 
                          'text-green-600'
                        }`}
                      >
                        Stock: {component.stock?.toFixed(3) || '0.000'}
                      </Text>
                    </HStack>
                  </VStack>
                  <Text className="w-16 text-right">{component.raw_qty}</Text>
                  <Text className="w-16 text-right text-gray-600">{component.xunit}</Text>
                  <Text className="w-20 text-right font-medium">৳{component.total_amt?.toFixed(2) || '0.00'}</Text>
                </HStack>
              ))}              {/* Total */}
              <HStack className="p-3 bg-gray-100 border-t border-gray-200">
                <Text className="flex-1 font-bold text-gray-800">Total Cost</Text>
                <Text className="w-20 text-right font-bold text-orange-600">
                  ৳{detailData.reduce((sum, item) => sum + (item.total_amt || 0), 0).toFixed(2)}
                </Text>
              </HStack>

            </Box>
          </Animated.View>
        ) : (
          <Box className="bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-center text-gray-500">No data found for this manufacturing order.</Text>
          </Box>
        )} 
      </ScrollView>
    </SafeAreaView>
  );
}
