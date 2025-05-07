import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, RefreshControl, Dimensions, Platform, View } from "react-native";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { ButtonText, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Fab, FabIcon } from "@/components/ui/fab";
import { useAuth } from "@/context/AuthContext";
import { Heading } from "@/components/ui/heading";
import { 
  LogOut, Package, Clock, RefreshCw, DollarSign, Plus, List, ChevronRight, 
  CheckCircle2, XCircle, MessageSquare, Menu, House, ShoppingCart, Truck, User,
  MapPin, Send
} from 'lucide-react-native';
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallbackText } from "@/components/ui/avatar";
import { router, usePathname } from "expo-router";
import { useState, useCallback, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

// Import separated components
import { 
  LoadingState, 
  StatsCard, 
  DrawerMenu,
  QuickActionCard,
  ManagementCard
} from "@/components/dashboard";

const screenWidth = Dimensions.get("window").width;

const Home = () => { 
  const { user, logout, loading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const pathname = usePathname();

  // Toggle drawer visibility
  const toggleDrawer = useCallback(() => {
    setIsDrawerVisible(prev => !prev);
  }, []);

  // Hardcoded stats as requested
  const stats = [
    { 
      title: "Total Orders", 
      value: "845", 
      color: "bg-primary-600",
      icon: Package,
      trend: "+12.5%",
      trendUp: true
    },
    { 
      title: "Orders Sent", 
      value: "10",
      color: "bg-gradient-to-br from-warning-500 via-warning-600 to-warning-700",
      icon: Clock,
      trend: "+5.2%",
      trendUp: true
    },
    { 
      title: "Total Revenue", 
      value: "৳1,245,630",
      color: "bg-gradient-to-br from-success-500 via-success-600 to-success-700",
      icon: DollarSign,
      trend: "+8.1%",
      trendUp: true
    },
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View style={{ flex: 1 }}>
        <ScrollView 
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <Box className="px-4 pt-4 pb-6">
            {/* Enhanced Header Section */}
            <Box className="rounded-2xl mb-4 overflow-hidden">
              <LinearGradient
                colors={['#1e293b', '#334155']}
                start={[0, 0]}
                end={[1, 1]}
                className="p-4 w-full"
                style={{
                  elevation: Platform.OS === 'android' ? 5 : 0,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  borderRadius: 16,
                }}
              >
                <VStack space="md">
                  <HStack className="justify-between items-start">
                    <VStack space="xs">
                      <Text className="text-white text-base font-medium">
                        {getTimeOfDay()},
                      </Text>
                      <Heading size="xl" className="text-white">
                        {user?.employee_name || user?.username || 'User'}
                      </Heading>
                      <HStack space="sm" className="items-center mt-1">
                        <Box className="bg-white/20 px-3 py-1 rounded-full">
                          <Text className="text-white text-xs">
                            Terminal: {user?.terminal || 'N/A'}
                          </Text>
                        </Box>
                        <Box className="bg-white/20 px-3 py-1 rounded-full">
                          <Text className="text-white text-xs">
                            ID: {user?.user_id || 'N/A'}
                          </Text>
                        </Box>
                      </HStack>
                    </VStack>
                    <HStack space="sm">
                      <Avatar 
                        size="lg" 
                        className="border-2 border-white bg-white/20"
                      >
                        <AvatarFallbackText className="text-white">
                          {getInitials(user?.employee_name || 'User')}
                        </AvatarFallbackText>
                      </Avatar>
                      <Button
                        variant="solid"
                        size="sm"
                        onPress={logout}
                        className="bg-white/20 self-start mt-1"
                      >
                        <ButtonIcon as={LogOut} size={18} className="text-white" />
                      </Button>
                    </HStack>
                  </HStack>

                  {/* User info card with better color scheme */}
                  <Box className="mt-4 rounded-2xl overflow-hidden">
                    <LinearGradient
                      colors={['#f97316', '#ea580c']}
                      start={[0, 0]}
                      end={[1, 1]}
                      className="p-4 w-full rounded-2xl"
                    >
                      <HStack className="justify-between items-center">
                        <Box className="items-start">
                          <Text className="text-white/80 text-xs">Business ID</Text>
                          <Text className="text-white font-bold">{user?.businessId || 'N/A'}</Text>
                        </Box>
                        
                        <Box className="w-[1px] h-8 bg-white/30" />
                        
                        <Box className="items-center">
                          <Text className="text-white/80 text-xs">Role</Text>
                          <Text className="text-white font-bold">{user?.is_admin || 'User'}</Text>
                        </Box>
                        
                        <Box className="w-[1px] h-8 bg-white/30" />
                        
                        <Box className="items-end">
                          <Text className="text-white/80 text-xs">Status</Text>
                          <Text className="text-white font-bold">{user?.status || 'N/A'}</Text>
                        </Box>
                      </HStack>
                    </LinearGradient>
                  </Box>
                </VStack>
              </LinearGradient>
            </Box>

            {/* Stats Section with enhanced spacing but no animations */}
            <VStack space="lg" className="mb-8">
              <HStack className="justify-between items-center mb-4">
                <VStack>
                  <Heading size="sm" className="text-gray-800">Dashboard Overview</Heading>
                  <Text className="text-gray-500 text-xs">Today's business summary</Text>
                </VStack>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={onRefresh}
                  className="border-primary-100 bg-primary-50"
                >
                  <HStack space="xs" className="items-center px-1">
                    <RefreshCw size={14} color="#ff8c00" />
                    <ButtonText className="text-primary-500 text-sm">Refresh</ButtonText>
                  </HStack>
                </Button>
              </HStack>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="py-2"
                contentContainerStyle={{
                  paddingRight: 16,
                }}
              >
                {stats.map((stat, index) => (
                  <StatsCard key={index} stat={stat} index={index} />
                ))}
              </ScrollView>
            </VStack>

            {/* Order Management with animations */}
            <VStack space="lg" className="mb-8">
              <HStack className="justify-between items-center mb-4">
                <VStack>
                  <Heading size="sm" className="text-gray-800">Order Management</Heading>
                  <Text className="text-gray-500 text-xs">Monitor and manage all orders</Text>
                </VStack>
              </HStack>
              
              <VStack space="md">
                <HStack space="md">
                  <ManagementCard 
                    title="Orders Sent" 
                    subtitle="Orders"
                    icon={Send}
                    gradientColors={['#374151', '#1f2937']}
                    onPress={() => router.push('/new-order')}
                  />
                  
                  <ManagementCard 
                    title="Confirmed" 
                    subtitle="Orders"
                    icon={CheckCircle2}
                    gradientColors={['#10b981', '#059669']}
                    onPress={() => router.push('/confirm-order')}
                  />
                </HStack>
                
                <HStack space="md">
                  <ManagementCard 
                    title="Cancelled" 
                    subtitle="Orders"
                    icon={XCircle}
                    gradientColors={['#f97316', '#ea580c']}
                    onPress={() => router.push('/cancel-order')}
                  />
                  
                  <ManagementCard 
                    title="Location" 
                    subtitle="Tracking"
                    icon={MapPin}
                    gradientColors={['#6366f1', '#4f46e5']}
                    onPress={() => router.push('/location')}
                  />
                </HStack>
              </VStack>
            </VStack>

            {/* Quick Actions - now with animations */}
            <VStack space="lg" className="mb-8">
              <HStack className="justify-between items-center mb-4">
                <VStack>
                  <Heading size="sm" className="text-gray-800">Quick Actions</Heading>
                  <Text className="text-gray-500 text-xs">Frequently used actions</Text>
                </VStack>
              </HStack>
              
              <VStack space="md">
                <HStack space="md">
                  <QuickActionCard 
                    title="New Order" 
                    subtitle="Create order"
                    icon={Plus}
                    gradientColors={['#2563eb', '#1d4ed8']}
                    onPress={() => router.push('/create-order')}
                  />
                  
                  <QuickActionCard 
                    title="Order List" 
                    subtitle="View all orders"
                    icon={List}
                    gradientColors={['#9333ea', '#7e22ce']}
                    onPress={() => router.push('/send-orders')}
                  />
                </HStack>
                
                <HStack space="md">
                  <QuickActionCard 
                    title="Home" 
                    subtitle="Dashboard"
                    icon={House}
                    gradientColors={['#0891b2', '#0e7490']}
                    onPress={() => router.push('/home')}
                  />
                  
                  <QuickActionCard 
                    title="Profile" 
                    subtitle="Account settings"
                    icon={User}
                    gradientColors={['#16a34a', '#15803d']}
                    onPress={() => router.push('/profile')}
                  />
                </HStack>
              </VStack>
            </VStack>
            
            {/* Bottom padding for FAB */}
            <Box className="h-16" />
          </Box>
        </ScrollView>
        
        {/* Floating Action Button - no animation */}
        <View
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
          }}
        >
          <Fab
            size="lg"
            placement="bottom right"
            isDisabled={isDrawerVisible}
            onPress={toggleDrawer}
            renderBackdrop={() => null}
            className="bg-primary-500 active:bg-primary-600"
          >
            <FabIcon as={Menu} />
          </Fab>
        </View>
        
        {/* Drawer Menu */}
        <DrawerMenu isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />
      </View>
    </SafeAreaView>
  );
};

export default Home;


