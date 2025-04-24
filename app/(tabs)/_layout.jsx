import { router, Tabs } from 'expo-router';
import { Platform, Animated, View } from 'react-native';
import { House, Package, User, ShoppingBag, CirclePlus, Send, ChevronLeft, Boxes } from 'lucide-react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Spinner } from '@/components/ui/spinner';
import { Center } from '@/components/ui/center';
import { useCallback, useState, useRef, useEffect } from 'react';

// Custom TabNavigationIndicator Component
const TabNavigationIndicator = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsVisible(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, 150); // Small delay before showing indicator

    // Auto-hide after a short period in case navigation completes quickly
    const hideTimeout = setTimeout(() => {
      hideIndicator();
    }, 800);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  const hideIndicator = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        opacity,
      }}
    >
      <Center>
        <Spinner size="large" color="$primary" />
      </Center>
    </Animated.View>
  );
};

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
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeout = useRef(null);

  // Custom navigation handler that shows indicators
  const handleTabNavigation = useCallback((route) => {
    setIsNavigating(true);
    
    // Clear previous timeout if it exists
    if (navigationTimeout.current) {
      clearTimeout(navigationTimeout.current);
    }
    
    // Set a timeout to hide indicator after navigation is likely complete
    navigationTimeout.current = setTimeout(() => {
      setIsNavigating(false);
    }, 800);
    
    router.push(route);
  }, []);

  // Pre-render tab headers to avoid re-renders during navigation
  const renderHomeTabIcon = useCallback((props) => <TabBarIcon {...props} icon={House} />, []);
  const renderCreateTabIcon = useCallback((props) => <TabBarIcon {...props} icon={CirclePlus} />, []);
  const renderSendTabIcon = useCallback((props) => <TabBarIcon {...props} icon={Send} />, []);
  const renderItemsTabIcon = useCallback((props) => <TabBarIcon {...props} icon={Boxes} />, []);
  const renderProfileTabIcon = useCallback((props) => <TabBarIcon {...props} icon={User} />, []);
  
  // Cleanup navigation timeout when component unmounts
  useEffect(() => {
    return () => {
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
    };
  }, []);
  
  return (
    <View style={{ flex: 1 }}>
      {isNavigating && <TabNavigationIndicator />}
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
          lazy: true,
          freezeOnBlur: false, // Prevents freezing UI when tab is not focused
          detachInactiveScreens: false, // Keep inactive screens attached for faster switching
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
          name="item-management"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleTabNavigation("/item-management");
            },
          }}
          options={{
            title: 'Items',
            tabBarIcon: renderItemsTabIcon,
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
