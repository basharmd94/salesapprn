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
import { Building2, Users, Database, Package, ShoppingBag, Factory, PackageCheck } from 'lucide-react-native';
import { COMPANY_ZIDS, COMPANY_NAMES } from '@/lib/api_items';

/**
 * Centralized CompanyFilterDrawer that can be used across the app
 * 
 * @param {Boolean} isOpen - Whether the drawer is open
 * @param {Function} onClose - Function to call when drawer is closed
 * @param {Function} onSelectCompany - Function to call when a company is selected
 * @param {String} currentZid - The currently selected ZID
 * @param {String} title - Optional title for the drawer (defaults to "Select Company")
 * @param {String} subtitle - Optional subtitle for the drawer
 * @param {String} type - Optional type to determine icon set ('customers', 'items', or default)
 */
const CompanyFilterDrawer = ({
  isOpen,
  onClose,
  onSelectCompany,
  currentZid,
  title = "Select Company",
  subtitle = "Choose a company to filter results",
  type = "default"
}) => {  // Use different icons based on type
  const getIcon = (id) => {
    if (type === 'customers') {
      return id === 'hmbr' ? Users : 
             id === 'gi' ? Database : 
             id === 'zepto' ? Users : Users;
    } else if (type === 'items') {
      return id === 'hmbr' ? ShoppingBag : 
             id === 'gi' ? Database : 
             id === 'zepto' ? Package : ShoppingBag;
    } else if (type === 'manufacturing') {
      return id === 'hmbr' ? PackageCheck : 
             id === 'gi' ? Factory : 
             id === 'zepto' ? PackageCheck : Factory;
    } else {
      return id === 'hmbr' ? Building2 : 
             id === 'gi' ? Building2 : 
             id === 'zepto' ? Building2 : Building2;
    }
  };
  // Get the title suffix based on type
  const getTitleSuffix = () => {
    if (type === 'customers') return "Customers";
    if (type === 'items') return "Items";
    if (type === 'manufacturing') return "Manufacturing";
    return "";
  };

  const companies = [
    {
      id: 'hmbr',
      name: 'HMBR',
      description: `HMBR ${getTitleSuffix()}`.trim(),
      zid: COMPANY_ZIDS.HMBR,
      color: '#f97316', // orange-500
    },
    {
      id: 'gi',
      name: 'GI',
      description: `GI ${getTitleSuffix()}`.trim(),
      zid: COMPANY_ZIDS.GI,
      color: '#0891b2', // cyan-600
    },
    {
      id: 'zepto',
      name: 'Zepto',
      description: `Zepto ${getTitleSuffix()}`.trim(),
      zid: COMPANY_ZIDS.ZEPTO,
      color: '#8b5cf6', // violet-500
    },
  ];
  // Customize header color/style based on type
  const getHeaderStyles = () => {
    if (type === 'customers') return { bg: 'bg-indigo-100', color: '#4f46e5' };
    if (type === 'items') return { bg: 'bg-orange-100', color: '#f97316' };
    if (type === 'manufacturing') return { bg: 'bg-blue-100', color: '#0891b2' };
    return { bg: 'bg-blue-100', color: '#3b82f6' };
  };

  const headerStyles = getHeaderStyles();

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
              <Heading size="md">{title}</Heading>
              <HStack space="md">
                <Box className={`${headerStyles.bg} px-2.5 py-1 rounded-lg`}>
                  <Building2 size={16} color={headerStyles.color} />
                </Box>
              </HStack>
            </Box>
            <Text className="text-gray-500 text-sm">
              {subtitle}
            </Text>
          </VStack>
        </DrawerHeader>
        
        <DrawerBody className="bg-gray-50">
          <VStack space="md" className="p-4">
            {companies.map((company) => {
              const Icon = getIcon(company.id);
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