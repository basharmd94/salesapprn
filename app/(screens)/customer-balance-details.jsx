import React, { useEffect, useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { ScrollView, View, ActivityIndicator } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  DollarSign, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  CreditCard, 
  ShoppingCart, 
  AlertCircle,
  Download
} from 'lucide-react-native';
import { Divider } from "@/components/ui/divider";
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useNavigation } from 'expo-router';

export default function CustomerBalanceDetailsScreen() {
  const { data, customerName } = useLocalSearchParams();
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    try {
      if (data) {
        const parsedData = JSON.parse(data);
        setBalanceData(parsedData);
      }
    } catch (error) {
      console.error('Error parsing balance data:', error);
    } finally {
      setLoading(false);
    }
  }, [data]);

  const getTransactionIcon = (entryType) => {
    switch (entryType) {
      case 'ORDER':
        return <ShoppingCart size={18} color="#f97316" />;
      case 'PAYMENT':
        return <CreditCard size={18} color="#10b981" />;
      case 'OPENING':
        return <Calendar size={18} color="#6366f1" />;
      default:
        return <AlertCircle size={18} color="#6b7280" />;
    }
  };

  const formatAmount = (amount) => {
    return `৳${Math.abs(amount).toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-600 mt-4">Loading balance data...</Text>
      </SafeAreaView>
    );
  }

  if (!balanceData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center p-4">
        <AlertCircle size={60} color="#ef4444" />
        <Heading size="lg" className="text-center mt-4 mb-2">Data Error</Heading>
        <Text className="text-gray-600 text-center">
          Could not load the balance data. Please try again.
        </Text>
        <Button
          variant="solid"
          className="bg-blue-600 mt-6 rounded-xl"
          size="lg"
          onPress={() => navigation.goBack()}
        >
          <ButtonText>Go Back</ButtonText>
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View 
          entering={FadeInDown.duration(500).springify()}
          className="p-4"
        >
          <VStack space="md" className="mb-6">
            <Card className="bg-white rounded-2xl p-6 border-l-4 border-l-blue-600">
              <HStack className="justify-between items-center">
                <VStack>
                  <Text className="text-gray-500 text-sm">Customer</Text>
                  <Heading size="md" className="text-gray-900">{customerName || balanceData.customer_id}</Heading>
                  <Text className="text-gray-500 text-xs mt-1">ID: {balanceData.customer_id}</Text>
                </VStack>
                <Box className="bg-blue-100 p-3 rounded-xl">
                  <DollarSign size={24} color="#2563eb" />
                </Box>
              </HStack>
              
              <Divider className="my-4" />
              
              <HStack className="justify-between items-center">
                <Box>
                  <Text className="text-gray-500 text-xs">Period</Text>
                  <HStack className="items-center space-x-1 mt-1">
                    <Text className="text-gray-700">{formatDate(balanceData.from_date)}</Text>
                    <Text className="text-gray-400">to</Text>
                    <Text className="text-gray-700">{formatDate(balanceData.to_date)}</Text>
                  </HStack>
                </Box>
                <Box>
                  <Text className="text-gray-500 text-xs text-right">Entries</Text>
                  <Text className="text-gray-700 text-right">{balanceData.total_entries}</Text>
                </Box>
              </HStack>
            </Card>

            <HStack space="md" className="mt-2">
              <Card className="bg-white rounded-2xl p-4 flex-1 border-t-4 border-t-blue-500">
                <Text className="text-gray-500 text-xs">Opening Balance</Text>
                <Heading size="md" className="mt-1">{formatAmount(balanceData.opening_balance)}</Heading>
                <HStack className="items-center mt-1">
                  <Box className="bg-blue-100 p-1 rounded-full mr-1">
                    <Calendar size={12} color="#3b82f6" />
                  </Box>
                  <Text className="text-xs text-gray-500">Initial</Text>
                </HStack>
              </Card>
              
              <Card className="bg-white rounded-2xl p-4 flex-1 border-t-4 border-t-green-500">
                <Text className="text-gray-500 text-xs">Closing Balance</Text>
                <Heading size="md" className="mt-1">{formatAmount(balanceData.closing_balance)}</Heading>
                <HStack className="items-center mt-1">
                  <Box className={`p-1 rounded-full mr-1 ${balanceData.closing_balance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {balanceData.closing_balance >= 0 ? 
                      <ArrowUp size={12} color="#10b981" /> : 
                      <ArrowDown size={12} color="#ef4444" />
                    }
                  </Box>
                  <Text className="text-xs text-gray-500">
                    {balanceData.closing_balance >= 0 ? 'Credit' : 'Debit'}
                  </Text>
                </HStack>
              </Card>
            </HStack>
            
            <Heading size="sm" className="mt-4 mb-2">Transaction History</Heading>
            
            <VStack space="md">
              {balanceData.ledger_entries.map((entry, index) => (
                <Animated.View 
                  key={`${entry.voucher}-${index}`}
                  entering={FadeInDown.delay(index * 50).duration(300)}
                >
                  <Card 
                    className={`bg-white rounded-xl p-4 border-l-4 ${
                      entry.entry_type === 'PAYMENT' 
                        ? 'border-l-green-500' 
                        : entry.entry_type === 'ORDER' 
                          ? 'border-l-orange-500' 
                          : 'border-l-blue-500'
                    }`}
                  >
                    <HStack className="items-center justify-between">
                      <HStack className="items-center space-x-3">
                        <Box 
                          className={`p-2 rounded-lg ${
                            entry.entry_type === 'PAYMENT' 
                              ? 'bg-green-100' 
                              : entry.entry_type === 'ORDER' 
                                ? 'bg-orange-100' 
                                : 'bg-blue-100'
                          }`}
                        >
                          {getTransactionIcon(entry.entry_type)}
                        </Box>
                        <VStack>
                          <Text className="font-medium">
                            {entry.entry_type === 'OPENING' 
                              ? 'Opening Balance' 
                              : entry.entry_type === 'PAYMENT' 
                                ? 'Payment Received' 
                                : 'Order Placed'}
                          </Text>
                          <HStack className="items-center space-x-1">
                            <Text className="text-xs text-gray-500">{formatDate(entry.transaction_date)}</Text>
                            {entry.voucher !== 'N/A' && (
                              <>
                                <Text className="text-gray-300">•</Text>
                                <Text className="text-xs text-gray-500">Voucher: {entry.voucher}</Text>
                              </>
                            )}
                          </HStack>
                        </VStack>
                      </HStack>
                      
                      <VStack className="items-end">
                        <Text 
                          className={`font-medium ${
                            entry.amount < 0 
                              ? 'text-green-600' 
                              : entry.amount > 0 
                                ? 'text-orange-600' 
                                : 'text-gray-600'
                          }`}
                        >
                          {entry.amount < 0 ? '-' : (entry.amount > 0 ? '+' : '')}{formatAmount(entry.amount)}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Balance: {formatAmount(entry.running_balance)}
                        </Text>
                      </VStack>
                    </HStack>
                  </Card>
                </Animated.View>
              ))}
            </VStack>
            
            <Button
              variant="outline"
              className="mt-4 border-blue-200 rounded-xl"
              size="lg"
            >
              <ButtonIcon as={Download} className="mr-2 text-blue-600" />
              <ButtonText className="text-blue-600">Export Statement</ButtonText>
            </Button>
          </VStack>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}