import React from 'react';
import { View, Pressable } from 'react-native';
import { Drawer, DrawerBackdrop, DrawerContent, DrawerHeader, DrawerBody } from '@/components/ui/drawer';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { ShoppingBag, Database, Package } from 'lucide-react-native';
import { COMPANY_ZIDS, COMPANY_NAMES } from '@/lib/api_items';
import AnimatedPageTransition from '@/components/AnimatedPageTransition';

const CompanyItem = ({ company, onSelect, isSelected }) => {
  const Icon = company.icon;
  
  return (
    <Pressable onPress={() => onSelect(company.zid, company.name)}>
      {({ pressed }) => (
        <AnimatedPageTransition
          animation="slideIn"
          duration={300}
          style={pressed ? { transform: [{ scale: 0.98 }], opacity: 0.9 } : {}}
        >
          <Box 
            className={`bg-white p-5 rounded-xl border mb-3 ${isSelected ? 'border-orange-400' : 'border-gray-100'}`}
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}
          >
            <HStack space="md" className="items-center">
              <Box style={{ backgroundColor: company.color }} className="p-3 rounded-lg">
                <Icon size={24} color="#fff" />
              </Box>
              <VStack>
                <Heading size="sm">{company.name}</Heading>
                <Text className="text-gray-500">{company.description}</Text>
              </VStack>
              {isSelected && (
                <Box className="ml-auto bg-orange-100 p-1 rounded-full">
                  <View className="bg-orange-400 w-4 h-4 rounded-full" />
                </Box>
              )}
            </HStack>
          </Box>
        </AnimatedPageTransition>
      )}
    </Pressable>
  );
};

const CompanyFilterDrawer = ({ 
  isOpen, 
  onClose, 
  onSelectCompany, 
  currentZid = COMPANY_ZIDS.HMBR 
}) => {
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

  const handleSelectCompany = (zid, name) => {
    onSelectCompany(zid, name);
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="full" anchor="bottom">
      <DrawerBackdrop />
      <DrawerContent className="h-2/3 rounded-t-3xl">
        <DrawerHeader className="bg-white border-b border-gray-100">
          <View className="p-4">
            <Text className="text-xs text-gray-600 uppercase mb-1">Select Business</Text>
            <HStack className="flex-row justify-between items-center">
              <Heading size="lg">Filter Inventory</Heading>
              <Box className="bg-orange-50 px-2 py-1 rounded-lg">
                <Text className="text-orange-700 font-semibold">ZID: {currentZid}</Text>
              </Box>
            </HStack>
          </View>
        </DrawerHeader>
        <DrawerBody className="bg-gray-50">
          <VStack space="md" className="p-4">
            {companies.map((company) => (
              <CompanyItem
                key={company.id}
                company={company}
                onSelect={handleSelectCompany}
                isSelected={currentZid === company.zid}
              />
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CompanyFilterDrawer;