import { router, Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { House, Package, User, ShoppingBag, CirclePlus, Send, ChevronLeft, Boxes } from 'lucide-react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Center } from '@/components/ui/center';
import { useCallback } from 'react';

const TabBarIcon = ({ focused, color, icon: Icon }) => {
  return (
    <Box className="items-center justify-center">
      <Icon 
        size={23} 
        color={color} 
        strokeWidth={focused ? 2 : 1.5}
      />
    </Box>
  );
};

export default function TabLayout() {
  // Simplified navigation handler without indicators
  const handleTabNavigation = useCallback((route) => {
    router.push(route);
  }, []);

  // Pre-render tab headers to avoid re-renders during navigation
  const renderHomeTabIcon = useCallback((props) => <TabBarIcon {...props} icon={House} />, []);
  const renderCreateTabIcon = useCallback((props) => <TabBarIcon {...props} icon={CirclePlus} />, []);
  const renderSendTabIcon = useCallback((props) => <TabBarIcon {...props} icon={Send} />, []);
  const renderItemsTabIcon = useCallback((props) => <TabBarIcon {...props} icon={Boxes} />, []);
  const renderProfileTabIcon = useCallback((props) => <TabBarIcon {...props} icon={User} />, []);
  
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#A8A8A8',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            height: 60,
            paddingHorizontal: 8,
            borderTopWidth: 1,
            borderTopColor: '#f3f4f6',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
          },
          tabBarItemStyle: {
            paddingVertical: 8,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
          },
          // Optimized tab navigation performance
          unmountOnBlur: false,
          lazy: false, // Changed to false to prevent loading delays
          freezeOnBlur: false,
          detachInactiveScreens: false,
          detachPreviousScreen: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: renderHomeTabIcon,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleTabNavigation("/home");
            },
          }}
        />
        <Tabs.Screen
          name="create-order"
          options={{
            title: 'Create',
            headerShown: false,
            headerTitle: 'Create',  
            headerStyle: {
              backgroundColor: "#DE7123",    
            },
            headerShadowVisible: false,
            headerTitleStyle: {
              fontSize: 16,
              fontWeight: '600',
            },
            headerLeft: () => (
              <Box className="ml-4">
                <Pressable onPress={() => router.back()}>
                  <ChevronLeft size={24} color="#fff" />
                </Pressable>
              </Box>
            ),
            tabBarIcon: renderCreateTabIcon,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleTabNavigation("/create-order");
            },
          }}
        />
        <Tabs.Screen
          name="send-orders"
          options={{
            title: 'Send',
            headerShown: false,
            headerTitle: 'Send Orders',
            headerTitleStyle: {
              fontSize: 16,
              fontWeight: '600',
            },
            headerStyle: {
              backgroundColor: "#DE7123",
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <Box className="ml-4">
                <Pressable onPress={() => router.back()}>
                  <ChevronLeft size={24} color="#fff" />
                </Pressable>
              </Box>
            ),
            tabBarIcon: renderSendTabIcon,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleTabNavigation("/send-orders");
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: renderProfileTabIcon,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleTabNavigation("/profile");
            },
          }}
        />
      </Tabs>
    </View>
  );
}
