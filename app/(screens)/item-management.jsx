import React, { useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { ActivityIndicator } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import { ShoppingBag } from 'lucide-react-native';
import { COMPANY_ZIDS, COMPANY_NAMES } from '@/lib/api_items';

export default function ItemManagementScreen() {
  const router = useRouter();

  // Automatically redirect to fetch_items with HMBR as default
  useEffect(() => {
    // Small delay to show loading indicator for better UX
    const redirectTimer = setTimeout(() => {
      const defaultZid = COMPANY_ZIDS.HMBR; // 100001
      const defaultCompanyName = COMPANY_NAMES[defaultZid]; // 'HMBR'
      
      router.replace({
        pathname: "/fetch_items",
        params: { 
          zid: defaultZid, 
          companyName: defaultCompanyName 
        }
      });
    }, 500);
    
    return () => clearTimeout(redirectTimer);
  }, [router]);

  // Show a loading screen while redirecting
  return (
    <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
      <Box className="p-4 items-center">
        <ShoppingBag size={50} color="#f97316" />
        <VStack space="sm" className="items-center mt-4">
          <Text className="text-gray-700 text-lg font-medium">Loading Inventory</Text>
          <Text className="text-gray-500 text-center">Redirecting to HMBR items...</Text>
          <ActivityIndicator size="large" color="#f97316" className="mt-4" />
        </VStack>
      </Box>
    </SafeAreaView>
  );
}