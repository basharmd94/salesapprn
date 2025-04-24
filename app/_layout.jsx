import "../global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { config } from '@gluestack-ui/config';
import { router } from 'expo-router';

// Prevent splash screen from auto-hiding before initialization
SplashScreen.preventAutoHideAsync();

function ProtectedRoute() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Only redirect if not loading and no user
      if (!user) {
        // Using replace to prevent navigation history
        router.replace('/sign-in');
      } 
      // No need to redirect to home if on index or auth pages
      // This is handled by the respective pages
    }
  }, [user, loading]);

  return null;
}

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen once everything is set
    SplashScreen.hideAsync();
  }, []);

  return (
    <GluestackUIProvider config={config}>
      <AuthProvider>
          <Stack
            screenOptions={{
              // Safe default animation settings to prevent the sceneStyleInterpolator error
              animation: 'fade',
              headerShown: false,
              // Disable custom interpolators that could cause issues
              animationEnabled: true,
              presentation: 'card',
              // Adding reasonable animation duration
              animationDuration: 250,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(screens)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="index" 
              options={{ 
                headerShown: false,
                // Prevent this screen from appearing in history
                gestureEnabled: false 
              }} 
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <ProtectedRoute />
      </AuthProvider>
    </GluestackUIProvider>
  );
}
