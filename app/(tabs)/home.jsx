import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, RefreshControl, Dimensions, Platform, Animated } from "react-native";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { ButtonText, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { useAuth } from "@/context/AuthContext";
import { Heading } from "@/components/ui/heading";
import { LogOut, Package, Clock, RefreshCw, DollarSign, Plus, List, ChevronRight, CheckCircle2, XCircle, MessageSquare, BarChart2, Users, ShoppingCart, Truck, Settings, Search } from 'lucide-react-native';
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallbackText } from "@/components/ui/avatar";
import { router, usePathname } from "expo-router";
import { useState, useCallback, useEffect, useRef } from 'react';
import { getOrderStats, getYearlyStats } from '@/lib/api_items';
import { LinearGradient } from 'expo-linear-gradient';

// Import separated components
import LoadingState from '@/components/dashboard/LoadingState';
import StatsCard from '@/components/dashboard/StatsCard';

const screenWidth = Dimensions.get("window").width;

// Fade-in animation component wrapper
const FadeInView = ({ children, delay = 0, duration = 500 }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
    
    return () => {
      opacity.setValue(0);
    };
  }, []);
  
  return (
    <Animated.View style={{ opacity }}>
      {children}
    </Animated.View>
  );
};

// Custom Card Component for Management Sections
const ManagementCard = ({ title, icon: Icon, onPress, subtitle, animationDelay = 0, gradientColors }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      delay: animationDelay,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };
  
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  return (
    <Animated.View 
      style={{ 
        transform: [{ scale }],
        opacity,
        flex: 1,
      }}
    >
      <Button
        variant="unstyled"
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        className="p-0 h-[90px] overflow-hidden rounded-2xl"
        style={{
          elevation: Platform.OS === 'android' ? 4 : 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <LinearGradient
          colors={gradientColors || ['#4c669f', '#3b5998', '#192f6a']}
          start={[0, 0]}
          end={[1, 1]}
          className="w-full h-full justify-center items-center rounded-2xl"
        >
          <VStack className="items-center space-y-1">
            <Icon size={26} color="white" />
            <Text className="text-white font-semibold text-sm">{title}</Text>
            {subtitle && (
              <Text className="text-white/80 text-xs">{subtitle}</Text>
            )}
          </VStack>
        </LinearGradient>
      </Button>
    </Animated.View>
  );
};

// Quick Action Card for consistent UI with Management Cards
const QuickActionCard = ({ title, icon: Icon, subtitle, onPress, animationDelay = 0, gradientColors }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      delay: animationDelay,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };
  
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  return (
    <Animated.View 
      style={{ 
        transform: [{ scale }],
        opacity,
        flex: 1,
      }}
    >
      <Button
        variant="unstyled"
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        className="p-0 h-[90px] overflow-hidden rounded-2xl"
        style={{
          elevation: Platform.OS === 'android' ? 4 : 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <LinearGradient
          colors={gradientColors}
          start={[0, 0]}
          end={[1, 1]}
          className="w-full h-full justify-center items-center rounded-2xl p-4"
        >
          <VStack className="items-center space-y-1">
            <Icon size={26} color="white" />
            <Text className="text-white font-semibold text-sm">{title}</Text>
            {subtitle && (
              <Text className="text-white/80 text-xs">{subtitle}</Text>
            )}
          </VStack>
        </LinearGradient>
      </Button>
    </Animated.View>
  );
};

const Home = () => { 
  const { user, logout, loading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [yearlyStats, setYearlyStats] = useState(null);
  const [orderStats, setOrderStats] = useState({
    total: 150,
    pending: 25,
    completed: 125
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pathname = usePathname();

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const [stats, yearly] = await Promise.all([
        getOrderStats(),
        getYearlyStats()
      ]);
      setOrderStats(stats);
      setYearlyStats(yearly);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats().then(() => {
      setIsReady(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
    
    return () => {
      fadeAnim.setValue(0);
    };
  }, [pathname]);

  const stats = [
    { 
      title: "Total Orders", 
      value: statsLoading ? <RefreshCw className="animate-spin" size={20} color="white" /> : 
             yearlyStats ? yearlyStats.total_orders.toString() : "0", 
      color: "bg-primary-600",
      icon: Package,
      trend: "+12.5%",
      trendUp: true
    },
    { 
      title: "Orders Sent", 
      value: statsLoading ? <RefreshCw className="animate-spin" size={20} color="white" /> : 
             yearlyStats ? yearlyStats.pending_orders.toString() : "0",
      color: "bg-gradient-to-br from-warning-500 via-warning-600 to-warning-700",
      icon: Clock,
      trend: "+5.2%",
      trendUp: true
    },
    { 
      title: "Total Revenue", 
      value: statsLoading ? <RefreshCw className="animate-spin" size={20} color="white" /> : 
             yearlyStats ? `৳${yearlyStats.total_amount.toLocaleString()}` : "৳0",
      color: "bg-gradient-to-br from-success-500 via-success-600 to-success-700",
      icon: DollarSign,
      trend: "+8.1%",
      trendUp: true
    },
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
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

  if (loading || !isReady) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView 
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <Box className="px-4 pt-4 pb-6">
            {/* Enhanced Header Section */}
            <FadeInView delay={100} duration={400}>
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
            </FadeInView>

            {/* Stats Section with enhanced spacing and animations */}
            <FadeInView delay={200} duration={400}>
              <VStack space="lg" className="mb-8">
                <HStack className="justify-between items-center mb-4">
                  <VStack>
                    <Heading size="sm" className="text-gray-800">Dashboard Overview</Heading>
                    <Text className="text-gray-500 text-xs">Today's business summary</Text>
                  </VStack>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={fetchStats}
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
                    <FadeInView key={index} delay={300 + (index * 100)} duration={400}>
                      <StatsCard stat={stat} index={index} />
                    </FadeInView>
                  ))}
                </ScrollView>
              </VStack>
            </FadeInView>

            {/* Quick Actions - Restructured to match Order Management layout */}
            <FadeInView delay={300} duration={400}>
              <VStack space="lg" className="mb-8">
                <HStack className="justify-between items-center mb-4">
                  <VStack>
                    <Heading size="sm" className="text-gray-800">Quick Actions</Heading>
                    <Text className="text-gray-500 text-xs">Frequently used actions</Text>
                  </VStack>
                  <Button
                    variant="link"
                    size="sm"
                    onPress={() => {}}
                    className="p-0"
                  >
                    <HStack space="xs" className="items-center">
                      <ButtonText className="text-primary-500 text-sm">View All</ButtonText>
                      <ChevronRight size={16} color="#ff8c00" />
                    </HStack>
                  </Button>
                </HStack>
                
                <VStack space="md">
                  <HStack space="md">
                    <QuickActionCard 
                      title="New Order" 
                      subtitle="Create order"
                      icon={Plus}
                      gradientColors={['#2563eb', '#1d4ed8']}
                      onPress={() => router.push('/create-order')}
                      animationDelay={350}
                    />
                    
                    <QuickActionCard 
                      title="Order List" 
                      subtitle="View all orders"
                      icon={List}
                      gradientColors={['#9333ea', '#7e22ce']}
                      onPress={() => router.push('/send-orders')}
                      animationDelay={400}
                    />
                  </HStack>
                  
                  <HStack space="md">
                    <QuickActionCard 
                      title="Customer" 
                      subtitle="Manage customers"
                      icon={Users}
                      gradientColors={['#0891b2', '#0e7490']}
                      onPress={() => {}}
                      animationDelay={450}
                    />
                    
                    <QuickActionCard 
                      title="Inventory" 
                      subtitle="Check stock"
                      icon={Package}
                      gradientColors={['#16a34a', '#15803d']}
                      onPress={() => router.push('/item-management')}
                      animationDelay={500}
                    />
                  </HStack>
                </VStack>
              </VStack>
            </FadeInView>

            {/* Order Management */}
            <FadeInView delay={450} duration={400}>
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
                      title="Pending" 
                      subtitle="Orders"
                      icon={Clock}
                      gradientColors={['#374151', '#1f2937']}
                      onPress={() => router.push('/new-order')}
                      animationDelay={550}
                    />
                    
                    <ManagementCard 
                      title="Confirmed" 
                      subtitle="Orders"
                      icon={CheckCircle2}
                      gradientColors={['#10b981', '#059669']}
                      onPress={() => router.push('/confirm-order')}
                      animationDelay={600}
                    />
                  </HStack>
                  
                  <HStack space="md">
                    <ManagementCard 
                      title="Cancelled" 
                      subtitle="Orders"
                      icon={XCircle}
                      gradientColors={['#f97316', '#ea580c']}
                      onPress={() => router.push('/cancel-order')}
                      animationDelay={650}
                    />
                    
                    <ManagementCard 
                      title="Delivery" 
                      subtitle="Tracking"
                      icon={Truck}
                      gradientColors={['#6366f1', '#4f46e5']}
                      onPress={() => router.push('/location')}
                      animationDelay={700}
                    />
                  </HStack>
                </VStack>
              </VStack>
            </FadeInView>
            
            {/* Customer Management */}
            <FadeInView delay={500} duration={400}>
              <VStack space="lg" className="mb-8">
                <HStack className="justify-between items-center mb-4">
                  <VStack>
                    <Heading size="sm" className="text-gray-800">Customer Management</Heading>
                    <Text className="text-gray-500 text-xs">Manage customer information and data</Text>
                  </VStack>
                </HStack>
                
                <VStack space="md">
                  <HStack space="md">
                    <ManagementCard 
                      title="Balance" 
                      subtitle="Check & Adjust"
                      icon={DollarSign}
                      gradientColors={['#f59e0b', '#d97706']}
                      onPress={() => router.push('/customer-balance')}
                      animationDelay={750}
                    />
                    
                    <ManagementCard 
                      title="Feedback" 
                      subtitle="Reviews & Ratings"
                      icon={MessageSquare}
                      gradientColors={['#8b5cf6', '#7c3aed']}
                      onPress={() => {}}
                      animationDelay={800}
                    />
                  </HStack>
                  
                  <HStack space="md">
                    <ManagementCard 
                      title="Analysis" 
                      subtitle="Behavior & Trends"
                      icon={BarChart2}
                      gradientColors={['#ec4899', '#db2777']}
                      onPress={() => {}}
                      animationDelay={850}
                    />
                    
                    <ManagementCard 
                      title="Profiles" 
                      subtitle="Account Details"
                      icon={Users}
                      gradientColors={['#06b6d4', '#0891b2']}
                      onPress={() => {}}
                      animationDelay={900}
                    />
                  </HStack>
                </VStack>
              </VStack>
            </FadeInView>
            
            {/* Product Management */}
            <FadeInView delay={550} duration={400}>
              <VStack space="lg" className="mb-8">
                <HStack className="justify-between items-center mb-4">
                  <VStack>
                    <Heading size="sm" className="text-gray-800">Product Management</Heading>
                    <Text className="text-gray-500 text-xs">Manage your products and inventory</Text>
                  </VStack>
                </HStack>
                
                <VStack space="md">
                  <HStack space="md">
                    <ManagementCard 
                      title="Inventory" 
                      subtitle="Stock Management"
                      icon={Package}
                      gradientColors={['#22c55e', '#16a34a']}
                      onPress={() => router.push('/item-management')}
                      animationDelay={950}
                    />
                    
                    <ManagementCard 
                      title="Catalog" 
                      subtitle="Product Listings"
                      icon={ShoppingCart}
                      gradientColors={['#f59e0b', '#d97706']}
                      onPress={() => router.push('/fetch_items')}
                      animationDelay={1000}
                    />
                  </HStack>
                  
                  <HStack space="md">
                    <ManagementCard 
                      title="Search" 
                      subtitle="Find Products"
                      icon={Search}
                      gradientColors={['#f43f5e', '#e11d48']}
                      onPress={() => {}}
                      animationDelay={1050}
                    />
                    
                    <ManagementCard 
                      title="Settings" 
                      subtitle="Product Preferences"
                      icon={Settings}
                      gradientColors={['#64748b', '#475569']}
                      onPress={() => {}}
                      animationDelay={1100}
                    />
                  </HStack>
                </VStack>
              </VStack>
            </FadeInView>
          </Box>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Home;


