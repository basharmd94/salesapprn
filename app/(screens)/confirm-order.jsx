import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { useRouter } from 'expo-router';
import { Package, ShoppingBag, Clock, Tag, CreditCard, Store, CheckCircle2 } from 'lucide-react-native';
import { getConfirmedOrders } from '@/lib/api_orders';

export default function ConfirmOrder() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      const result = await getConfirmedOrders();
      setOrders(result.orders || []);
    } catch (err) {
      console.error('Failed to fetch confirmed orders:', err);
      setError('Failed to load confirmed orders. Pull down to refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, [fetchOrders]);
  
  // Function to truncate long strings
  const truncateText = (text, maxLength = 30) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Box className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-600 mt-4">Loading confirmed orders...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Box className="flex-1 p-4">
        <HStack className="items-center justify-between mb-4">
          <VStack>
            <Heading size="lg" className="text-gray-800">Last 10 Confirmed Orders</Heading>
            <Text className="text-gray-500">Orders ready for processing</Text>
          </VStack>
          
          {orders.length > 0 && (
            <Badge size="md" variant="solid" className="bg-emerald-500 rounded-full">
              <BadgeText className="text-white">{orders.length} Orders</BadgeText>
            </Badge>
          )}
        </HStack>
        
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {error ? (
            <Box className="flex-1 justify-center items-center py-10">
              <Text className="text-error-600 text-center mb-4">{error}</Text>
              <Button variant="outline" onPress={onRefresh}>
                <ButtonText>Try Again</ButtonText>
              </Button>
            </Box>
          ) : orders.length === 0 ? (
            <Box className="flex-1 justify-center items-center py-20">
              <CheckCircle2 size={50} className="text-gray-300 mb-4" />
              <Text className="text-gray-500 text-center">No confirmed orders found</Text>
              <Text className="text-gray-400 text-center text-xs mt-2">Pull down to refresh</Text>
            </Box>
          ) : (
            <VStack space="md" className="pb-4">
              {orders.map((order) => (
                <Card
                  key={order.invoiceno}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                >
                  {/* Order Header */}
                  <Box className="p-4 bg-gradient-to-r from-emerald-50 to-white border-b border-gray-100">
                    <HStack justifyContent="space-between" alignItems="center">
                      <HStack space="sm" alignItems="center">
                        <Box className="bg-emerald-500 p-2 rounded-full flex items-center justify-center">
                          <Package size={16} color="white" />
                        </Box>
                        <VStack>
                          <Text className="font-medium text-gray-900">
                            {order.invoiceno}
                          </Text>
                          <HStack space="sm" alignItems="center" className="mt-1">
                            <Box className="bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                              <Text className="text-2xs font-medium text-gray-600">
                                ZID: {order.zid}
                              </Text>
                            </Box>
                            <Badge variant="outline" className="border-emerald-200 bg-emerald-50">
                              <BadgeText className="text-2xs text-emerald-700">{order.xstatusord}</BadgeText>
                            </Badge>
                          </HStack>
                        </VStack>
                      </HStack>
                    </HStack>
                  </Box>
                  
                  {/* Order Content */}
                  <VStack space="sm" className="p-4">
                    <HStack space="sm" alignItems="center">
                      <Store size={16} className="text-gray-500" />
                      <Text className="text-sm text-gray-800 font-medium">
                        {order.xcusname} ({order.xcus})
                      </Text>
                    </HStack>
                    
                    <Divider className="my-1 bg-gray-100" />
                    
                    <VStack space="xs">
                      <Text className="text-xs font-medium text-gray-500 mb-1">
                        ORDER ITEMS
                      </Text>
                      <Box className="bg-gray-50 rounded-lg p-3">
                        <Text className="text-xs text-gray-600 leading-relaxed">
                          {truncateText(order.items, 100)}
                        </Text>
                      </Box>
                    </VStack>
                    
                    <HStack className="justify-between mt-2">
                      <VStack space="xs">
                        <HStack space="xs" alignItems="center">
                          <Tag size={12} className="text-gray-500" />
                          <Text className="text-xs text-gray-500">
                            Total Items
                          </Text>
                        </HStack>
                        <Text className="font-semibold text-gray-800">
                          {order.total_qty} units
                        </Text>
                      </VStack>
                      
                      <VStack space="xs">
                        <HStack space="xs" alignItems="center">
                          <CreditCard size={12} className="text-gray-500" />
                          <Text className="text-xs text-gray-500">
                            Total Amount
                          </Text>
                        </HStack>
                        <Text className="font-semibold text-gray-800">
                          ৳{order.total_linetotal.toLocaleString()}
                        </Text>
                      </VStack>
                      
                      <VStack space="xs">
                        <HStack space="xs" alignItems="center">
                          <Clock size={12} className="text-gray-500" />
                          <Text className="text-xs text-gray-500">
                            Status
                          </Text>
                        </HStack>
                        <Text className="font-semibold text-emerald-600">
                          {order.xstatusord}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </Card>
              ))}
            </VStack>
          )}
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}