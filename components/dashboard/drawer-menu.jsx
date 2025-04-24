import React, { useRef, useEffect, useState } from 'react';
import { Animated, Dimensions, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { router } from 'expo-router';
// Fix: Import UI components individually instead of from a single import
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import { ScrollView } from "@/components/ui/scroll-view";
import { Pressable } from "@/components/ui/pressable";
import { Center } from "@/components/ui/center";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Search,
  Settings,
  CreditCard,
  ClipboardList,
  BarChart2,
  TrendingUp,
  Truck,
  MessageSquare,
  Bell,
  X,
  DollarSign
} from 'lucide-react-native';
import logger from '@/utils/logger';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.85;

/**
 * Menu Item component for drawer menu items
 */
const MenuItem = ({ icon: Icon, title, onPress, description }) => (
  <Pressable 
    onPress={onPress}
    className="py-3 px-4 rounded-xl active:bg-gray-100 active:opacity-70"
  >
    <HStack space="md" alignItems="center">
      <Box className="bg-primary-50 p-2 rounded-lg">
        <Icon size={22} color="#f97316" strokeWidth={1.5} />
      </Box>
      <VStack>
        <Text className="text-gray-800 font-medium">{title}</Text>
        {description && (
          <Text className="text-gray-500 text-xs">{description}</Text>
        )}
      </VStack>
    </HStack>
  </Pressable>
);

/**
 * Category section component for drawer menu
 */
const CategorySection = ({ title, children }) => (
  <VStack space="sm" className="mb-4">
    <HStack className="px-4 mb-1">
      <Heading size="sm" className="text-gray-700">{title}</Heading>
    </HStack>
    <VStack className="bg-white rounded-xl mx-2">
      {children}
    </VStack>
  </VStack>
);

/**
 * Drawer Menu component for dashboard navigation
 */
const DrawerMenu = ({ isVisible, onClose }) => {
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [showDrawer, setShowDrawer] = useState(false);
  
  // Set initial drawer state when visibility changes
  useEffect(() => {
    if (isVisible && !showDrawer) {
      setShowDrawer(true);
    }
  }, [isVisible]);

  // Handle drawer animation when visibility changes
  useEffect(() => {
    if (isVisible) {
      // Open drawer
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (showDrawer) {
      // Close drawer with callback to completely unmount when animation is done
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Clean up by unmounting drawer after animation completes
        setShowDrawer(false);
      });
    }
  }, [isVisible, showDrawer]);

  // Handle back button press
  useEffect(() => {
    const handleBackPress = () => {
      if (isVisible) {
        onClose();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [isVisible, onClose]);

  // Navigate to a route and close drawer
  const navigateTo = (route) => {
    onClose();
    router.push(route);
  };

  // Don't render anything if drawer shouldn't be shown
  if (!showDrawer) {
    return null;
  }

  return (
    <Box pointerEvents={isVisible ? "auto" : "none"} className="absolute inset-0 z-50">
      {/* Backdrop */}
      <Animated.View 
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: '#000', opacity: opacity }
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={{ width: '100%', height: '100%' }}
        />
      </Animated.View>

      {/* Drawer Content */}
      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX }] }
        ]}
      >
        {/* Header */}
        <VStack className="bg-primary-600 py-12 px-6 rounded-br-3xl">
          <HStack className="justify-between items-center mb-4">
            <Heading className="text-white">Menu</Heading>
            <Pressable onPress={onClose} className="p-2">
              <X size={24} color="#fff" />
            </Pressable>
          </HStack>
          <Text className="text-white/80">Manage your business operations</Text>
        </VStack>

        {/* Menu Items */}
        <ScrollView className="flex-1 bg-gray-50 pt-4">
          {/* Customer Management */}
          <CategorySection title="Customer Management">
            <MenuItem 
              icon={Users} 
              title="Customer Profiles" 
              description="View and manage customers" 
              onPress={() => navigateTo('/customer-profiles')} 
            />
            <Divider className="bg-gray-100" />
            <MenuItem 
              icon={CreditCard} 
              title="Balance Management" 
              description="Check customer balances" 
              onPress={() => navigateTo('/customer-balance')} 
            />
            <Divider className="bg-gray-100" />
            <MenuItem 
              icon={MessageSquare} 
              title="Feedback & Reviews" 
              description="Customer feedback" 
              onPress={() => navigateTo('/customer-feedback')} 
            />
            <Divider className="bg-gray-100" />
            <MenuItem 
              icon={BarChart2} 
              title="Customer Analytics" 
              description="Behavior trends" 
              onPress={() => navigateTo('/customer-analytics')} 
            />
          </CategorySection>

          {/* Product Management */}
          <CategorySection title="Product Management">
            <MenuItem 
              icon={Package} 
              title="Inventory" 
              description="Stock management" 
              onPress={() => navigateTo('/item-management')} 
            />
            <Divider className="bg-gray-100" />
            <MenuItem 
              icon={ShoppingCart} 
              title="Product Catalog" 
              description="Manage product listings" 
              onPress={() => navigateTo('/fetch_items')} 
            />
            <Divider className="bg-gray-100" />
            <MenuItem 
              icon={Search} 
              title="Product Search" 
              description="Find products quickly" 
              onPress={() => navigateTo('/search-products')} 
            />
            <Divider className="bg-gray-100" />
            <MenuItem 
              icon={Settings} 
              title="Product Settings" 
              description="Configure product options" 
              onPress={() => navigateTo('/product-settings')} 
            />
          </CategorySection>

          {/* Additional Management */}
          <CategorySection title="Additional Management">
            <MenuItem 
              icon={ClipboardList} 
              title="Order History" 
              description="View all past orders" 
              onPress={() => navigateTo('/order-history')} 
            />
            <Divider className="bg-gray-100" />
            <MenuItem 
              icon={DollarSign} 
              title="Revenue Reports" 
              description="Financial summary" 
              onPress={() => navigateTo('/revenue-reports')} 
            />
            <Divider className="bg-gray-100" />
            <MenuItem 
              icon={Truck} 
              title="Delivery Tracking" 
              description="Monitor deliveries" 
              onPress={() => navigateTo('/location')} 
            />
            <Divider className="bg-gray-100" />
            <MenuItem 
              icon={TrendingUp} 
              title="Sales Analytics" 
              description="Performance metrics" 
              onPress={() => navigateTo('/sales-analytics')} 
            />
          </CategorySection>

          {/* Extra space at bottom */}
          <Box className="h-8" />
        </ScrollView>
      </Animated.View>
    </Box>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});

export default DrawerMenu;