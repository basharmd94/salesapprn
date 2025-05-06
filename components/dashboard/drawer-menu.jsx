import React, { useRef, useEffect, useState } from 'react';
import { Animated, Dimensions, TouchableOpacity, StyleSheet, BackHandler, Image } from 'react-native';
import { router } from 'expo-router';
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import { ScrollView } from "@/components/ui/scroll-view";
import { Pressable } from "@/components/ui/pressable";
import { Center } from "@/components/ui/center";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallbackText } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button";
import { LinearGradient } from 'expo-linear-gradient';
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
  DollarSign,
  ChevronRight,
  Send,
  SendHorizonal,
  SendIcon
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import logger from '@/utils/logger';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.85;

/**
 * Menu Item component for drawer menu items
 */
const MenuItem = ({ icon: Icon, title, onPress, description, badge, isActive = false }) => (
  <Pressable 
    onPress={onPress}
    className={`py-3 px-4 rounded-xl active:bg-primary-50 ${isActive ? 'bg-primary-50' : ''}`}
  >
    <HStack space="md" alignItems="center" justifyContent="space-between">
      <HStack space="md" alignItems="center">
        <Box className={`p-2 rounded-lg ${isActive ? 'bg-primary-100' : 'bg-gray-100'}`}>
          <Icon size={22} color={isActive ? "#ff8c00" : "#64748b"} strokeWidth={1.5} />
        </Box>
        <VStack>
          <Text className={`font-medium ${isActive ? 'text-primary-700' : 'text-gray-800'}`}>{title}</Text>
          {description && (
            <Text className="text-gray-500 text-xs">{description}</Text>
          )}
        </VStack>
      </HStack>
      
      <HStack space="sm" alignItems="center">
        {badge && (
          <Badge size="sm" variant="solid" action="warning" className="rounded-full">
            <Text className="text-white text-xs font-medium">{badge}</Text>
          </Badge>
        )}
        <ChevronRight size={16} color="#94a3b8" />
      </HStack>
    </HStack>
  </Pressable>
);

/**
 * Category section component for drawer menu
 */
const CategorySection = ({ title, icon: Icon, children }) => (
  <VStack space="sm" className="mb-6">
    <HStack className="px-4 mb-1" space="sm" alignItems="center">
      {Icon && <Icon size={18} color="#64748b" strokeWidth={1.5} />}
      <Heading size="sm" className="text-gray-600 font-medium">{title}</Heading>
    </HStack>
    <VStack className="bg-white rounded-xl mx-2 shadow-sm border border-gray-100">
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
  // Always render the drawer component but with visibility control
  // This prevents the initialization delay when opening
  const [mounted, setMounted] = useState(true);
  const { user } = useAuth();
  
  // Get current active route
  const [activeRoute, setActiveRoute] = useState('/home');

  // Handle drawer animation when visibility changes
  useEffect(() => {
    if (isVisible) {
      // Open drawer - faster animation for better responsiveness
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 200, // Reduced from 300ms to 200ms
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Close drawer with callback
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

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

  // Navigate to a route and close drawer simultaneously
  const navigateTo = (route) => {
    setActiveRoute(route);
    
    // Start closing the drawer animation
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate to the route immediately without waiting for drawer to close
    // This creates a smoother transition as the navigation starts while the drawer is closing
    setTimeout(() => {
      router.push(route);
      onClose();
    }, 100); // Reduced from 150ms to 100ms for better responsiveness
  };

  // Get initials from user name
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Instead of conditional rendering, use opacity to control visibility
  // This keeps the component ready to animate immediately
  return (
    <Box 
      pointerEvents={isVisible ? "auto" : "none"} 
      className="absolute inset-0 z-50"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
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
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          start={[0, 0]}
          end={[1, 1]}
          className="pt-16 pb-8 px-6 rounded-br-3xl"
        >
          <HStack className="justify-between items-center">
            <HStack space="md" alignItems="center">
              <Avatar 
                size="lg" 
                className="border-2 border-white/20 bg-white/20"
              >
                <AvatarFallbackText className="text-white">
                  {getInitials(user?.employee_name || 'User')}
                </AvatarFallbackText>
              </Avatar>
              <VStack>
                <Heading className="text-white text-lg">
                  {user?.employee_name || user?.username || 'User'}
                </Heading>
                <Text className="text-white/80 text-sm">
                  {user?.is_admin ? 'Administrator' : 'User'}
                </Text>
              </VStack>
            </HStack>
            <Pressable 
              onPress={onClose} 
              className="bg-white/20 p-2.5 rounded-full"
            >
              <X size={20} color="#fff" />
            </Pressable>
          </HStack>
        </LinearGradient>

        {/* Menu Items */}
        <ScrollView className="flex-1 bg-gray-50 pt-6">
          {/* Customer Management */}
          <CategorySection title="Customer Management" icon={Users}>
            <MenuItem 
              icon={Users} 
              title="Customer Profiles" 
              description="View and manage customers" 
              onPress={() => navigateTo('/customer-profile')} 
              isActive={activeRoute === '/customer-profile'}
            />
            <Divider className="bg-gray-100" />
            <MenuItem 
              icon={CreditCard} 
              title="Customer Balance" 
              description="Check customer balances" 
              // onPress={() => navigateTo('/customer-balance')} 
              isActive={activeRoute === '/customer-balance'}
              badge="3"
            />
            <Divider className="bg-gray-100" />
            {/* <MenuItem 
              icon={MessageSquare} 
              title="Feedback & Reviews" 
              description="Customer feedback" 
              onPress={() => navigateTo('/customer-feedback')} 
              isActive={activeRoute === '/customer-feedback'}
            /> */}
          </CategorySection>

          {/* Product Management */}
          <CategorySection title="Product Management" icon={Package}>
            <MenuItem 
              icon={Package} 
              title="Inventory" 
              description="Stock management" 
              onPress={() => navigateTo('/fetch_items')} 
              isActive={activeRoute === '/fetch_items'}
            />
            <Divider className="bg-gray-100" />

          </CategorySection>

          {/* Order Management */}
          <CategorySection title="Order Management" icon={ClipboardList}>
            <MenuItem 
              icon={Send} 
              title="Orders Sent" 
              description="View all orders sent" 
              onPress={() => navigateTo('/new-order')} 
              isActive={activeRoute === '/order-history'}
              badge="12"
            />
            <Divider className="bg-gray-100" />
            <MenuItem 
              icon={ClipboardList}
              title="Orders Confirmed"
              description="View all confirmed orders" 
              onPress={() => navigateTo('/confirm-order')} 
              isActive={activeRoute === '/confirm-order'}
            />
            <Divider className="bg-gray-100" />
            <MenuItem 
              icon={X} 
              title="Canceled Orders"
              description="View all canceled orders" 
              onPress={() => navigateTo('/cancel-order')}
              isActive={activeRoute === '/cancel-order'} 
            />
          </CategorySection>

          {/* Analysis */}
          <CategorySection title="Analytics & Reports" icon={BarChart2}>
            <MenuItem 
              icon={TrendingUp} 
              title="Sales Analytics" 
              description="Performance metrics" 
              onPress={() => navigateTo('/sales-analytics')} 
              isActive={activeRoute === '/sales-analytics'}
            />
            <Divider className="bg-gray-100" />
            <MenuItem 
              icon={BarChart2} 
              title="Business Dashboard" 
              description="Overview statistics" 
              onPress={() => navigateTo('/business-dashboard')} 
              isActive={activeRoute === '/business-dashboard'}
            />
          </CategorySection>

          {/* Extra space at bottom */}
          <Box className="h-8" />
        </ScrollView>
        
        {/* Footer */}
        <Box className="bg-gray-50 p-4 border-t border-gray-200">
          <Button
            size="sm"
            variant="outline"
            action="secondary"
            className="w-full rounded-xl"
            onPress={() => router.push('/profile')}
          >
            <HStack space="sm" alignItems="center">
              <Settings size={16} color="#64748b" />
              <ButtonText className="text-gray-700">Settings</ButtonText>
            </HStack>
          </Button>
        </Box>
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