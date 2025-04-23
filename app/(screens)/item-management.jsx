import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { ScrollView, StyleSheet, Pressable } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { useRouter } from "expo-router";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Database, Package } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getAllCompanies, COMPANY_ZIDS } from '@/lib/api_items';

export default function ItemManagementScreen() {
  const router = useRouter();

  const companies = [
    {
      id: 'hmbr',
      name: 'HMBR',
      description: 'HMBR inventory management',
      zid: COMPANY_ZIDS.HMBR,
      icon: ShoppingBag,
      color: '#f97316', // orange-500
    },
    {
      id: 'gi',
      name: 'GI',
      description: 'GI inventory management',
      zid: COMPANY_ZIDS.GI,
      icon: Database,
      color: '#0891b2', // cyan-600
    },
    {
      id: 'zepto',
      name: 'Zepto',
      description: 'Zepto inventory management',
      zid: COMPANY_ZIDS.ZEPTO,
      icon: Package,
      color: '#8b5cf6', // violet-500
    },
  ];

  const navigateToItems = (zid, companyName) => {
    router.push({
      pathname: "/fetch_items",
      params: { zid, companyName }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        <Animated.View 
          entering={FadeInDown.duration(500).springify()}
          className="p-4"
        >
          <VStack space="md" className="items-center mb-6">
            <ShoppingBag size={60} color="#f97316" />
            <Heading size="xl" className="text-center">Item Management</Heading>
            <Text className="text-gray-500 text-center px-6">
              Select a company to view and manage its inventory items
            </Text>
          </VStack>
          
          <VStack space="md" className="mt-4">
            {companies.map((company, index) => {
              const Icon = company.icon;
              
              return (
                <Pressable 
                  key={company.id}
                  onPress={() => navigateToItems(company.zid, company.name)}
                >
                  {({ pressed }) => (
                    <Animated.View
                      entering={FadeInDown.delay(index * 100).duration(400)}
                      style={[
                        pressed ? { transform: [{ scale: 0.98 }], opacity: 0.9 } : {}
                      ]}
                    >
                      <Card className="bg-white p-5 rounded-2xl">
                        <HStack space="md" className="items-center">
                          <Box style={{ backgroundColor: company.color }} className="p-3 rounded-lg">
                            <Icon size={24} color="#fff" />
                          </Box>
                          <VStack>
                            <Heading size="md">{company.name}</Heading>
                            <Text className="text-gray-500">{company.description}</Text>
                          </VStack>
                        </HStack>
                      </Card>
                    </Animated.View>
                  )}
                </Pressable>
              );
            })}
          </VStack>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}