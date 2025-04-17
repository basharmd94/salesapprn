import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { useToast, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Calendar, CheckCircle2, XCircle, ArrowLeft, AlertCircle, Check } from 'lucide-react-native';
import { ScrollView } from "react-native";

export default function ConfirmOrder() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (params.orderData) {
      try {
        const parsedData = JSON.parse(params.orderData);
        setOrderData(parsedData);
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    }
  }, [params.orderData]);

  const calculateTotal = useCallback(() => {
    if (!orderData?.items) return 0;
    return orderData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  }, [orderData]);

  const handleSubmitOrder = useCallback(() => {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Show success toast
      toast.show({
        placement: 'top',
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toast nativeID={uniqueToastId} action="success" variant="solid">
              <VStack space="xs">
                <HStack space="sm" alignItems="center">
                  <Check size={18} className="text-white" />
                  <ToastTitle>Success</ToastTitle>
                </HStack>
                <ToastDescription>Order has been confirmed successfully!</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
      
      // Navigate to home screen after success
      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 1000);
    }, 1500);
  }, [orderData, toast, router]);

  const handleCancel = useCallback(() => {
    router.push('/cancel-order');
  }, [router]);

  if (!orderData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Box className="flex-1 justify-center items-center p-4">
          <AlertCircle size={40} className="text-gray-400 mb-4" />
          <Text className="text-gray-600">No order data available</Text>
          <Button 
            size="sm" 
            variant="outline"
            onPress={() => router.back()}
            className="mt-6"
          >
            <ButtonText>Go Back</ButtonText>
          </Button>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1 p-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space="lg">
            <HStack className="justify-between items-center">
              <Button 
                variant="ghost"
                size="sm"
                onPress={() => router.back()}
                className="p-0"
              >
                <ButtonIcon as={ArrowLeft} size={18} className="text-gray-600" />
                <ButtonText className="text-gray-600 ml-1">Back</ButtonText>
              </Button>
              
              <Box className="bg-primary-50 px-3 py-1.5 rounded-full">
                <HStack space="xs" alignItems="center">
                  <Calendar size={14} className="text-primary-600" />
                  <Text className="text-xs font-medium text-primary-600">
                    {orderData.orderDate}
                  </Text>
                </HStack>
              </Box>
            </HStack>
            
            <Heading size="xl" className="text-gray-800 mt-2">Confirm Order</Heading>
            
            <Card className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <VStack space="md">
                <HStack className="justify-between">
                  <Text className="text-gray-500">Order Number:</Text>
                  <Text className="font-medium">{orderData.orderNumber}</Text>
                </HStack>
                
                <HStack className="justify-between">
                  <Text className="text-gray-500">Customer:</Text>
                  <Text className="font-medium">{orderData.customerName}</Text>
                </HStack>
                
                <Divider className="my-2" />
                
                <Text className="font-medium text-gray-700">Order Items</Text>
                
                <VStack space="sm" className="bg-gray-50 rounded-lg p-3">
                  {orderData.items.map((item, index) => (
                    <HStack key={item.id} className="justify-between py-2">
                      <HStack space="sm">
                        <Text className="font-medium">{item.name}</Text>
                        <Text className="text-gray-500">x{item.quantity}</Text>
                      </HStack>
                      <Text className="font-medium">৳{item.price * item.quantity}</Text>
                    </HStack>
                  ))}
                  
                  <Divider className="my-2" />
                  
                  <HStack className="justify-between">
                    <Text className="font-semibold">Total Amount</Text>
                    <Text className="font-bold text-lg">৳{calculateTotal()}</Text>
                  </HStack>
                </VStack>
              </VStack>
            </Card>
            
            <Box className="h-6" />
          </VStack>
        </ScrollView>
        
        <Box className="border-t border-gray-200 pt-4 mt-4">
          <HStack space="md">
            <Button 
              size="lg"
              variant="outline"
              onPress={handleCancel}
              className="flex-1 border-error-300 rounded-xl"
            >
              <ButtonIcon as={XCircle} size={18} className="text-error-600 mr-1" />
              <ButtonText className="text-error-600">Cancel</ButtonText>
            </Button>
            
            <Button 
              size="lg"
              onPress={handleSubmitOrder}
              isDisabled={isSubmitting}
              className="flex-1 bg-success-600 rounded-xl"
            >
              {isSubmitting ? (
                <ButtonText>Submitting...</ButtonText>
              ) : (
                <>
                  <ButtonIcon as={CheckCircle2} size={18} className="text-white mr-1" />
                  <ButtonText>Confirm Order</ButtonText>
                </>
              )}
            </Button>
          </HStack>
        </Box>
      </Box>
    </SafeAreaView>
  );
}