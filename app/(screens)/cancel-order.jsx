import { useState, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { useToast, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertCircle, Check, CircleX } from 'lucide-react-native';
import { ScrollView } from "react-native";

export default function CancelOrder() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  
  const handleCancel = useCallback(() => {
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
                <ToastDescription>Order has been cancelled successfully</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
      
      // Navigate to home after success
      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 1000);
    }, 1500);
  }, [toast, router]);
  
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1 p-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space="lg">
            <HStack className="justify-between items-center">
              <Button 
                variant="ghost"
                size="sm"
                onPress={handleGoBack}
                className="p-0"
              >
                <ButtonIcon as={ArrowLeft} size={18} className="text-gray-600" />
                <ButtonText className="text-gray-600 ml-1">Back</ButtonText>
              </Button>
              
              <Box className="bg-error-50 px-3 py-1.5 rounded-full">
                <HStack space="xs" alignItems="center">
                  <CircleX size={14} className="text-error-600" />
                  <Text className="text-xs font-medium text-error-600">
                    Cancellation
                  </Text>
                </HStack>
              </Box>
            </HStack>
            
            <VStack space="xs">
              <Heading size="xl" className="text-gray-800 mt-2">Cancel Order</Heading>
              <Text className="text-gray-500">Are you sure you want to cancel this order?</Text>
            </VStack>
            
            <Box className="h-6" />
          </VStack>
        </ScrollView>
        
        <Box className="border-t border-gray-200 pt-4 mt-4">
          <HStack space="md">
            <Button 
              size="lg"
              variant="outline"
              onPress={handleGoBack}
              className="flex-1 border-gray-300 rounded-xl"
            >
              <ButtonText className="text-gray-600">Go Back</ButtonText>
            </Button>
            
            <Button 
              size="lg"
              onPress={handleCancel}
              isDisabled={isSubmitting}
              className="flex-1 bg-error-600 rounded-xl"
            >
              {isSubmitting ? (
                <ButtonText>Processing...</ButtonText>
              ) : (
                <ButtonText>Confirm Cancellation</ButtonText>
              )}
            </Button>
          </HStack>
        </Box>
      </Box>
    </SafeAreaView>
  );
}