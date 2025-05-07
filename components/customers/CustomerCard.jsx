import React from 'react';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { User, MapPin, Phone, Tag, Building, Briefcase, MessageSquare, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { TouchableOpacity, View, StyleSheet, Linking } from 'react-native';
import { router } from 'expo-router';

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

  // Handle phone button press - completely standalone function
  const callPhone = () => {
    const phoneUrl = `tel:${customer.xmobile}`;
    Linking.openURL(phoneUrl).catch(err => {
      console.error("Could not open phone: " + err.message);
    });
  };

  // Handle feedback button press - completely standalone function
  const openFeedback = () => {
    try {
      router.push({
        pathname: "/(screens)/customer-feedback",
        params: {
          xcus: customer.xcus,
          zid: customer.zid,
          xorg: customer.xorg,
          xmobile: customer.xmobile,
        }
      });
    } catch (error) {
      console.error("Navigation Error", error.message);
    }
  };

  return (
    <Animated.View entering={AnimationComponent.duration(300).springify()}>
      <Card 
        className="mb-3 p-0 bg-white rounded-xl overflow-hidden shadow-sm border border-orange-100"
        onPress={onPress}
      >
        {/* Card header with customer info */}
        <View className="p-4">
          <HStack space="md" alignItems="center">
            <Box className="bg-orange-50 rounded-full w-16 h-16 items-center justify-center shadow-sm">
              <User size={28} color="#f97316" />
            </Box>
            <VStack space="xs" flex={1} className="ml-2">
              <Text className="text-gray-900 font-semibold text-lg" numberOfLines={2}>
                {customer.xorg}
              </Text>
              {customer.xmobile && (
                <HStack space="sm" alignItems="center">
                  <Phone size={14} color="#f97316" />
                  <Text className="text-orange-500 text-sm font-medium">
                    {customer.xmobile}
                  </Text>
                </HStack>
              )}
              {customer.xcity && (
                <HStack space="sm" alignItems="center">
                  <MapPin size={14} color="#4b5563" />
                  <Text className="text-gray-600 text-sm" numberOfLines={1}>
                    {customer.xcity}{customer.xadd1 ? ` — ${customer.xadd1}` : ''}
                  </Text>
                </HStack>
              )}
            </VStack>
          </HStack>
        </View>
        
        {/* Icon buttons row - in a separate card section with gradient background */}
        <View className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 border-t border-orange-100">
          <HStack justifyContent="space-around">
            <TouchableOpacity 
              style={styles.actionButton}
              className="bg-white"
              onPress={callPhone}
            >
              <Phone size={18} color="#f97316" />
              <Text className="text-orange-700 text-xs font-medium ml-2">Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              className="bg-white"
            >
              <Briefcase size={18} color="#f59e0b" />
              <Text className="text-amber-700 text-xs font-medium ml-2">Analysis</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              className="bg-white"
              onPress={openFeedback}
            >
              <MessageSquare size={18} color="#ea580c" />
              <Text className="text-orange-800 text-xs font-medium ml-2">Feedback</Text>
            </TouchableOpacity>
          </HStack>
        </View>
        
        {/* {customer.xsp && (
          <View className="px-4 py-2 bg-amber-50 border-t border-amber-100">
            <HStack space="xs" alignItems="center">
              <Tag size={14} color="#b45309" />
              <Text className="text-amber-800 text-xs font-medium">SP: {customer.xsp}</Text>
              <View style={{flex: 1}} />
              <ChevronRight size={14} color="#b45309" />
            </HStack>
          </View>
        )} */}
      </Card>
    </Animated.View>
  );
};

// Pure React Native styles for better control
const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  phoneButton: {
    backgroundColor: '#fff7ed', // orange-50
  },
  feedbackButton: {
    backgroundColor: '#ffedd5', // amber-50
  },
  buttonPressed: {
    opacity: 0.7,
  },
  phoneText: {
    color: '#c2410c', // orange-700
    fontSize: 12,
    marginLeft: 4,
  },
  feedbackText: {
    color: '#b45309', // amber-700
    fontSize: 12,
    marginLeft: 4,
  },
  iconButtonRow: {
    marginTop: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6', // gray-100
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomerCard;