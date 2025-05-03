import React from 'react';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { User, MapPin, Phone, Tag, Building, Briefcase } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { TouchableOpacity, Linking, Alert } from 'react-native';

/**
 * Reusable CustomerCard component for displaying customer information
 * 
 * @param {Object} customer - The customer object containing profile information
 * @param {Function} onPress - Optional onPress handler for the card
 * @param {String} animation - Animation type ('fadeInRight', 'fadeIn', etc.)
 */
const CustomerCard = ({ 
  customer, 
  onPress, 
  animation = 'fadeInRight',
}) => {
  const AnimationComponent = animation === 'fadeInRight' ? FadeInRight : FadeInRight;

  const handlePhonePress = (phoneNumber) => {
    // Handle phone number formatting - remove any non-numeric characters
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    
    // Format the URL for dialing
    const phoneUrl = `tel:${formattedPhone}`;
    
    // Try to open the dialpad with the phone number
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert(
            "Phone not supported",
            "Your device doesn't support making phone calls."
          );
        }
      })
      .catch((err) => {
        console.error('Error opening dialpad:', err);
        Alert.alert("Error", "Could not open phone dialpad.");
      });
  };

  return (
    <Animated.View entering={AnimationComponent.duration(300).springify()}>
      <Card 
        className="mb-3 p-4 bg-white rounded-xl"
        onPress={onPress}
      >
        <VStack space="md">
          <HStack space="md" alignItems="center">
            <Box className="bg-gray-100 rounded-lg w-16 h-16 items-center justify-center">
              <User size={32} color="#6366f1" />
            </Box>
            <VStack space="xs" flex={1}>
              <Text className="text-gray-800 font-medium text-lg" numberOfLines={2}>
                {customer.xorg}
              </Text>
              <HStack space="sm" alignItems="center">
                <Tag size={14} color="#6b7280" />
                <Text className="text-gray-500 text-sm">
                  Customer ID: {customer.xcus}
                </Text>
              </HStack>
            </VStack>
          </HStack>
          
          <HStack space="sm" flexWrap="wrap">
            {customer.xmobile && (
              <TouchableOpacity 
                onPress={() => handlePhonePress(customer.xmobile)}
                activeOpacity={0.7}
              >
                <Box className="bg-indigo-50 px-3 py-1.5 rounded-lg mr-2 mb-2 active:bg-indigo-100">
                  <HStack space="xs" alignItems="center">
                    <Phone size={14} color="#4f46e5" />
                    <Text className="text-indigo-700 text-xs">{customer.xmobile}</Text>
                  </HStack>
                </Box>
              </TouchableOpacity>
            )}
            
            {customer.xcity && (
              <Box className="bg-emerald-50 px-3 py-1.5 rounded-lg mr-2 mb-2">
                <HStack space="xs" alignItems="center">
                  <MapPin size={14} color="#059669" />
                  <Text className="text-emerald-700 text-xs">
                    {customer.xcity}{customer.xstate ? `, ${customer.xstate}` : ''}
                  </Text>
                </HStack>
              </Box>
            )}
            
            {customer.xsp && (
              <Box className="bg-amber-50 px-3 py-1.5 rounded-lg mb-2">
                <HStack space="xs" alignItems="center">
                  <Briefcase size={14} color="#b45309" />
                  <Text className="text-amber-700 text-xs">SP: {customer.xsp}</Text>
                </HStack>
              </Box>
            )}
          </HStack>
          
          {customer.xadd1 && (
            <HStack space="xs" alignItems="flex-start">
              <Building size={16} color="#6b7280" className="mt-0.5" />
              <Text className="text-gray-600 text-sm flex-1">
                {customer.xadd1}
              </Text>
            </HStack>
          )}
        </VStack>
      </Card>
    </Animated.View>
  );
};

export default CustomerCard;