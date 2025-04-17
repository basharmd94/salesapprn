import { useState, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { FormControl, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { useRouter } from 'expo-router';
import { Calendar, Package, Plus, ArrowRight } from 'lucide-react-native';
import { ScrollView } from "react-native";

export default function NewOrder() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([]);
  
  const handleAddItem = useCallback(() => {
    // Navigate to item selection screen or show item picker
    // For now, just add a placeholder item
    setItems(prev => [...prev, { 
      id: Date.now(),
      name: `Item ${prev.length + 1}`,
      quantity: 1,
      price: Math.floor(Math.random() * 500) + 100
    }]);
  }, []);
  
  const handleContinue = useCallback(() => {
    // In a real app, you would validate and pass this data to the next screen
    const orderData = {
      orderNumber,
      customerName,
      orderDate,
      items
    };
    
    // Pass order data to confirmation screen
    router.push({
      pathname: '/confirm-order',
      params: { orderData: JSON.stringify(orderData) }
    });
  }, [orderNumber, customerName, orderDate, items, router]);
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1 p-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space="lg">
            <HStack className="justify-between items-center">
              <Heading size="xl" className="text-gray-800">New Order</Heading>
              <Box className="bg-primary-50 px-3 py-1.5 rounded-full">
                <HStack space="xs" alignItems="center">
                  <Calendar size={14} className="text-primary-600" />
                  <Text className="text-xs font-medium text-primary-600">
                    {orderDate}
                  </Text>
                </HStack>
              </Box>
            </HStack>
            
            <VStack space="md" className="mt-4">
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText className="text-gray-700 font-medium">
                    Order Number
                  </FormControlLabelText>
                </FormControlLabel>
                <Input size="md" className="border border-gray-200 rounded-lg">
                  <InputField 
                    placeholder="Enter order number"
                    value={orderNumber}
                    onChangeText={setOrderNumber}
                  />
                </Input>
              </FormControl>
              
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText className="text-gray-700 font-medium">
                    Customer Name
                  </FormControlLabelText>
                </FormControlLabel>
                <Input size="md" className="border border-gray-200 rounded-lg">
                  <InputField 
                    placeholder="Enter customer name"
                    value={customerName}
                    onChangeText={setCustomerName}
                  />
                </Input>
              </FormControl>
              
              <Box className="mt-6">
                <HStack className="justify-between items-center mb-4">
                  <Text className="text-gray-700 font-medium">Items</Text>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onPress={handleAddItem}
                    className="border border-primary-300 rounded-full"
                  >
                    <ButtonIcon as={Plus} size={16} className="text-primary-600 mr-1" />
                    <ButtonText className="text-primary-600">Add Item</ButtonText>
                  </Button>
                </HStack>
                
                <VStack space="md" className="bg-gray-50 rounded-xl p-4">
                  {items.length === 0 ? (
                    <Box className="items-center py-8">
                      <Package size={40} className="text-gray-400 mb-2" />
                      <Text className="text-gray-500">No items added yet</Text>
                    </Box>
                  ) : (
                    items.map((item, index) => (
                      <Box key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
                        <HStack className="justify-between items-center">
                          <VStack>
                            <Text className="font-medium">{item.name}</Text>
                            <Text className="text-sm text-gray-500">Qty: {item.quantity}</Text>
                          </VStack>
                          <Text className="font-semibold">৳{item.price}</Text>
                        </HStack>
                      </Box>
                    ))
                  )}
                </VStack>
              </Box>
              
              <Box className="h-6" />
            </VStack>
          </VStack>
        </ScrollView>
        
        <Box className="border-t border-gray-200 pt-4 mt-4">
          <Button 
            size="lg"
            onPress={handleContinue}
            isDisabled={!orderNumber || !customerName || items.length === 0}
            className="bg-primary-600 rounded-full"
          >
            <ButtonText>Continue to Confirmation</ButtonText>
            <ButtonIcon as={ArrowRight} className="ml-1" />
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}