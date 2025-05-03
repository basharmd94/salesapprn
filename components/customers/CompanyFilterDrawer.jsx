import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@/components/ui/drawer";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Building2, Users, Database, Package } from 'lucide-react-native';
import { COMPANY_ZIDS, COMPANY_NAMES } from '@/lib/api_items';

/**
 * Reusable CompanyFilterDrawer for customer filtering by company
 * 
 * @param {Boolean} isOpen - Whether the drawer is open
 * @param {Function} onClose - Function to call when drawer is closed
 * @param {Function} onSelectCompany - Function to call when a company is selected
 * @param {String} currentZid - The currently selected ZID
 */
const CompanyFilterDrawer = ({ isOpen, onClose, onSelectCompany, currentZid }) => {
  const companies = [
    {
      id: 'hmbr',
      name: 'HMBR',
      description: 'HMBR Customers',
      zid: COMPANY_ZIDS.HMBR,
      icon: Users,
      color: '#f97316', // orange-500
    },
    {
      id: 'gi',
      name: 'GI',
      description: 'GI Customers',
      zid: COMPANY_ZIDS.GI,
      icon: Database,
      color: '#0891b2', // cyan-600
    },
    {
      id: 'zepto',
      name: 'Zepto',
      description: 'Zepto Customers',
      zid: COMPANY_ZIDS.ZEPTO,
      icon: Package,
      color: '#8b5cf6', // violet-500
    },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      anchor="bottom"
    >
      <DrawerBackdrop />
      <DrawerContent className="h-[85%]">
        <DrawerHeader className="bg-white border-b border-gray-100">
          <VStack space="sm" className="p-4">
            <Text className="text-xs text-gray-600 uppercase">Filter by Company</Text>
            <Box className="flex-row justify-between items-center">
              <Heading size="md">Select Company</Heading>
              <HStack space="md">
                <Box className="bg-indigo-100 px-2.5 py-1 rounded-lg">
                  <Building2 size={16} color="#4f46e5" />
                </Box>
              </HStack>
            </Box>
            <Text className="text-gray-500 text-sm">
              Choose a company to view its customer profiles
            </Text>
          </VStack>
        </DrawerHeader>
        
        <DrawerBody className="bg-gray-50">
          <VStack space="md" className="p-4">
            {companies.map((company) => {
              const Icon = company.icon;
              const isSelected = currentZid === company.zid;
              
              return (
                <TouchableOpacity
                  key={company.id}
                  onPress={() => {
                    onSelectCompany(company.zid, company.name);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Box className={`p-4 rounded-2xl ${isSelected ? 'bg-indigo-50 border border-indigo-200' : 'bg-white border border-gray-200'}`}>
                    <HStack space="md" alignItems="center">
                      <Box style={{ backgroundColor: company.color }} className="p-3 rounded-xl">
                        <Icon size={24} color="#fff" />
                      </Box>
                      <VStack>
                        <Text className={`text-lg font-semibold ${isSelected ? 'text-indigo-700' : 'text-gray-800'}`}>
                          {company.name}
                        </Text>
                        <Text className="text-gray-500">
                          {company.description}
                        </Text>
                      </VStack>
                      
                      {isSelected && (
                        <Box className="ml-auto bg-indigo-100 p-2 rounded-full">
                          <View className="w-3 h-3 rounded-full bg-indigo-500" />
                        </Box>
                      )}
                    </HStack>
                  </Box>
                </TouchableOpacity>
              );
            })}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CompanyFilterDrawer;