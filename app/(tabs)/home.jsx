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
import { router } from "expo-router";
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { getOrderStats, getYearlyStats } from '@/lib/api_items';
import {
  LineChart,
  BarChart,
  PieChart,
} from "react-native-chart-kit";

// Import separated components
import LoadingState from '@/components/dashboard/LoadingState';
import StatsCard from '@/components/dashboard/StatsCard';
import ChartCard from '@/components/dashboard/ChartCard';
import QuickActionCard from '@/components/dashboard/QuickActionCard';

const screenWidth = Dimensions.get("window").width;

// Custom Card Component for Management Sections
const ManagementCard = ({ title, icon: Icon, color, onPress, subtitle }) => {
  const scale = useRef(new Animated.Value(1)).current;
  
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
        flex: 1,
      }}
    >
      <Button
        variant="solid"
        className={`${color} h-[90px] rounded-2xl shadow-sm`}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={{
          elevation: Platform.OS === 'android' ? 2 : 0,
        }}
      >
        <VStack className="items-center space-y-1">
          <Icon size={26} color="white" />
          <Text className="text-white font-semibold text-sm">{title}</Text>
          {subtitle && (
            <Text className="text-white/80 text-xs">{subtitle}</Text>
          )}
        </VStack>
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

  // Transform monthly stats data for charts
  const chartData = useMemo(() => {
    if (!yearlyStats) {
      return {
        monthlyData: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [{
            data: [20, 45, 28, 80, 99, 43],
            color: (opacity = 1) => `rgba(255, 160, 1, ${opacity})`,
            strokeWidth: 2
          }],
        },
        orderTypeData: [
          {
            name: "Regular",
            orders: 45,
            color: "#FF6384",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12
          },
          {
            name: "Express",
            orders: 25,
            color: "#36A2EB",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12
          },
          {
            name: "Priority",
            orders: 30,
            color: "#FFCE56",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12
          }
        ],
        dailyOrdersData: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [{
            data: [15, 12, 18, 25, 22, 20, 10]
          }]
        }
      };
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = new Array(12).fill(0);
    
    yearlyStats.monthly_stats.forEach(stat => {
      monthlyData[stat.month - 1] = stat.total_orders;
    });

    return {
      monthlyData: {
        labels: monthNames,
        datasets: [{
          data: monthlyData,
          color: (opacity = 1) => `rgba(255, 160, 1, ${opacity})`,
          strokeWidth: 2
        }],
      },
      orderTypeData: [
        {
          name: "Regular",
          orders: 45,
          color: "#FF6384",
          legendFontColor: "#7F7F7F",
          legendFontSize: 12
        },
        {
          name: "Express",
          orders: 25,
          color: "#36A2EB",
          legendFontColor: "#7F7F7F",
          legendFontSize: 12
        },
        {
          name: "Priority",
          orders: 30,
          color: "#FFCE56",
          legendFontColor: "#7F7F7F",
          legendFontSize: 12
        }
      ],
      dailyOrdersData: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          data: [15, 12, 18, 25, 22, 20, 10]
        }]
      }
    };
  }, [yearlyStats]);

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
    fetchStats();
  }, []);

  const chartConfig = useMemo(() => ({
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(255, 160, 1, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.8,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 11,
      fontFamily: 'System',
      fontWeight: '500',
      color: '#64748b',
    },
    propsForBackgroundLines: {
      strokeDasharray: "6 6",
      stroke: "#f1f5f9",
      strokeWidth: 1,
    },
    fillShadowGradient: "#FFA001",
    fillShadowGradientOpacity: 0.3,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
  }), []);

  const stats = [
    { 
      title: "Total Orders", 
      value: statsLoading ? <RefreshCw className="animate-spin" size={20} color="white" /> : 
             yearlyStats ? yearlyStats.total_orders.toString() : "0", 
      color: "bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700",
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

  const quickActions = [
    { 
      title: "Create Order", 
      icon: Plus, 
      primary: true,
      onPress: () => router.push('/create-order'),
      description: "Create a new customer order",
    },
    { 
      title: "View Orders", 
      icon: List, 
      primary: false,
      onPress: () => router.push('/send-orders'),
      description: "Check order history",
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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Box className="px-4 pt-4 pb-6">
          {/* Enhanced Header Section */}
          <Box 
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 mb-6"
            style={{
              elevation: Platform.OS === 'android' ? 5 : 0,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
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
              <Box className="mt-4 bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-2xl">
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
              </Box>
            </VStack>
          </Box>

          {/* Stats Section with enhanced spacing and animations */}
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
                <StatsCard key={index} stat={stat} index={index} />
              ))}
            </ScrollView>
          </VStack>

          {/* Quick Actions */}
          <VStack space="lg" className="mb-8">
            <HStack className="justify-between items-center mb-2">
              <Heading size="sm" className="text-gray-800">Quick Actions</Heading>
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
            
            <HStack space="md">
              <Button 
                variant="solid"
                className="flex-1 h-[80px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-sm"
                onPress={() => router.push('/create-order')}
                style={{
                  elevation: Platform.OS === 'android' ? 2 : 0,
                  shadowColor: '#3b82f6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                }}
              >
                <HStack space="md" className="items-center">
                  <Box className="bg-white/20 p-2 rounded-full">
                    <Plus size={20} color="white" />
                  </Box>
                  <VStack className="items-start">
                    <Text className="text-white font-bold">New Order</Text>
                    <Text className="text-white/80 text-xs">Create order</Text>
                  </VStack>
                </HStack>
              </Button>
              
              <Button 
                variant="solid"
                className="flex-1 h-[80px] bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-sm"
                onPress={() => router.push('/send-orders')}
                style={{
                  elevation: Platform.OS === 'android' ? 2 : 0,
                  shadowColor: '#8b5cf6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                }}
              >
                <HStack space="md" className="items-center">
                  <Box className="bg-white/20 p-2 rounded-full">
                    <List size={20} color="white" />
                  </Box>
                  <VStack className="items-start">
                    <Text className="text-white font-bold">Orders</Text>
                    <Text className="text-white/80 text-xs">View history</Text>
                  </VStack>
                </HStack>
              </Button>
            </HStack>
          </VStack>

          {/* Order Management */}
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
                  color="bg-gradient-to-br from-gray-700 to-gray-800"
                  onPress={() => router.push('/new-order')}
                />
                
                <ManagementCard 
                  title="Confirmed" 
                  subtitle="Orders"
                  icon={CheckCircle2}
                  color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                  onPress={() => router.push('/confirm-order')}
                />
              </HStack>
              
              <HStack space="md">
                <ManagementCard 
                  title="Cancelled" 
                  subtitle="Orders"
                  icon={XCircle}
                  color="bg-gradient-to-br from-orange-500 to-orange-600"
                  onPress={() => router.push('/cancel-order')}
                />
                
                <ManagementCard 
                  title="Delivery" 
                  subtitle="Tracking"
                  icon={Truck}
                  color="bg-gradient-to-br from-indigo-500 to-indigo-600"
                  onPress={() => router.push('/location')}
                />
              </HStack>
            </VStack>
          </VStack>
          
          {/* Customer Management */}
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
                  color="bg-gradient-to-br from-blue-500 to-blue-600"
                  onPress={() => router.push('/customer-balance')}
                />
                
                <ManagementCard 
                  title="Feedback" 
                  subtitle="Reviews & Ratings"
                  icon={MessageSquare}
                  color="bg-gradient-to-br from-purple-500 to-purple-600"
                  onPress={() => router.push('/customer-feedback')}
                />
              </HStack>
              
              <HStack space="md">
                <ManagementCard 
                  title="Analysis" 
                  subtitle="Behavior & Trends"
                  icon={BarChart2}
                  color="bg-gradient-to-br from-pink-500 to-pink-600"
                  onPress={() => router.push('/customer-analysis')}
                />
                
                <ManagementCard 
                  title="Profiles" 
                  subtitle="Account Details"
                  icon={Users}
                  color="bg-gradient-to-br from-cyan-500 to-cyan-600"
                  onPress={() => {}}
                />
              </HStack>
            </VStack>
          </VStack>
          
          {/* Product Management */}
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
                  color="bg-gradient-to-br from-green-500 to-green-600"
                  onPress={() => router.push('/item-management')}
                />
                
                <ManagementCard 
                  title="Catalog" 
                  subtitle="Product Listings"
                  icon={ShoppingCart}
                  color="bg-gradient-to-br from-amber-500 to-amber-600"
                  onPress={() => router.push('/fetch_items')}
                />
              </HStack>
              
              <HStack space="md">
                <ManagementCard 
                  title="Search" 
                  subtitle="Find Products"
                  icon={Search}
                  color="bg-gradient-to-br from-rose-500 to-rose-600"
                  onPress={() => {}}
                />
                
                <ManagementCard 
                  title="Settings" 
                  subtitle="Product Preferences"
                  icon={Settings}
                  color="bg-gradient-to-br from-slate-500 to-slate-600"
                  onPress={() => {}}
                />
              </HStack>
            </VStack>
          </VStack>

          {/* Charts Section */}
          <VStack space="lg" className="mb-8">
            <HStack className="justify-between items-center mb-4">
              <VStack>
                <Heading size="sm" className="text-gray-800">Analytics</Heading>
                <Text className="text-gray-500 text-xs">Business performance metrics</Text>
              </VStack>
            </HStack>
            
            {/* Monthly Orders Chart */}
            <ChartCard 
              title="Monthly Orders" 
              subtitle="+23.5% vs last month"
              subtitleColor="bg-primary-50"
            >
              <Box className="rounded-2xl overflow-hidden bg-gray-50/50 p-4">
                <LineChart
                  data={chartData.monthlyData}
                  width={screenWidth - 64}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    propsForDots: {
                      r: "4",
                      stroke: "#FFA001",
                      strokeWidth: "2",
                      fill: "#fff"
                    }
                  }}
                  bezier
                  style={{
                    borderRadius: 16
                  }}
                  withHorizontalLines={true}
                  withVerticalLines={false}
                  withDots={true}
                  withShadow={true}
                  segments={5}
                  withInnerLines={true}
                  getDotColor={() => "#FFA001"}
                />
              </Box>
            </ChartCard>

            {/* Order Type Distribution */}
            <ChartCard 
              title="Order Distribution" 
              subtitle="Well balanced"
              subtitleColor="bg-success-50"
            >
              <Box className="rounded-2xl overflow-hidden bg-gray-50/50 p-4">
                <PieChart
                  data={chartData.orderTypeData}
                  width={screenWidth - 64}
                  height={220}
                  chartConfig={chartConfig}
                  accessor={"orders"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                  center={[10, 0]}
                  absolute
                  hasLegend={true}
                  avoidFalseZero={true}
                />
              </Box>
            </ChartCard>

            {/* Daily Orders Chart */}
            <ChartCard 
              title="Daily Performance" 
              subtitle="Peak on Thursday"
              subtitleColor="bg-warning-50"
            >
              <Box className="rounded-2xl overflow-hidden bg-gray-50/50 p-4">
                <BarChart
                  data={chartData.dailyOrdersData}
                  width={screenWidth - 64}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    barPercentage: 0.7,
                  }}
                  style={{
                    borderRadius: 16
                  }}
                  showBarTops={true}
                  showValuesOnTopOfBars={true}
                  fromZero={true}
                  withInnerLines={true}
                  segments={5}
                />
              </Box>
            </ChartCard>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;


