import React from 'react';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Badge } from "@/components/ui/badge";
import { Linking, Platform, Alert } from 'react-native';
import { Clipboard, PackageCheck, Calendar, BarChart2, FileText, Download, DollarSign } from "lucide-react-native";
import { useRouter } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Button, ButtonText } from "@/components/ui/button";

const ManufacturingItemCard = ({ item, index = 0 }) => {
  const router = useRouter();
  
  // Format date string to display as DD MMM YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Navigate to details page
  const handleViewDetails = () => {
    router.push({
      pathname: '/mo-detail',
      params: { 
        zid: item.zid, 
        moNumber: item.xmoord,
        xitem: item.xitem,
        xdesc: item.xdesc,
        xqtyprd: item.xqtyprd,
      }
    });
  };

  // Navigate to last MO details
  const handleLastMODetails = () => {
    if (item.last_mo_number) {
      router.push({
        pathname: '/mo-detail',
        params: { 
          zid: item.zid, 
          moNumber: item.last_mo_number,
          // We don't have specific item details for last MO, 
          // so use current item details as a fallback
          xitem: item.xitem,
          xdesc: item.xdesc,
          // Use the last MO quantity instead of current MO quantity
          xqtyprd: item.last_mo_qty, 
        }
      });
    }
  };

  // Handle export
  const handleExport = () => {
    try {
      import('@/lib/api_manufacturing').then(({ export_manufacturing_order }) => {
        // Get the export URL
        const exportUrl = export_manufacturing_order(item.zid, item.xmoord, true);
        
        // Open in browser for web or handle through Linking for mobile
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined') {
            window.open(exportUrl, '_blank');
          }
        } else {
          Linking.openURL(exportUrl).catch((err) => {
            Alert.alert('Error', 'Could not open the export URL: ' + err.message);
          });
        }
      });
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Error', 'Failed to export the manufacturing order.');
    }
  };
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(400)}
    >
      <Pressable onPress={handleViewDetails}>
        <Box 
          className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
          style={{ elevation: 2 }}
        >
          <VStack space="md">
            {/* Header with MO Number and Date */}
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space="sm" alignItems="center">
                <Box className="bg-secondary-400 p-2 rounded-lg">
                  <Clipboard size={18} color="#f97316" />
                </Box>
                <VStack>
                  <Text className="font-semibold text-gray-800">{item.xmoord}</Text>
                  <HStack space="xs" alignItems="center">
                    <Calendar size={12} color="#FB8C00" />
                    <Text className="text-sm text-gray-500">{formatDate(item.xdate)}</Text>
                  </HStack>
                </VStack>
              </HStack>
              <Badge 
                variant="outline"
                className="border-orange-500"
              >
                <Text className="text-orange-600 text-sm">{item.xunit}</Text>
              </Badge>
            </HStack>
            
            {/* Item Details */}
            <VStack space="sm">
              <HStack space="sm">
                <Text className="text-gray-600 w-20">Item Code:</Text>
                <Text className="flex-1 font-medium text-gray-800">{item.xitem}</Text>
              </HStack>
              <HStack space="sm">
                <Text className="text-gray-600 w-20">Desc:</Text>
                <Text className="flex-1 text-gray-800">{item.xdesc}</Text>
              </HStack>
            </VStack>
            
            {/* Production Details */}
            <HStack space="md" justifyContent="space-between" className="px-1 py-2 mt-1 bg-gray-50 rounded-lg">
              <VStack alignItems="center" className="flex-1">
                <HStack space="xs" alignItems="center">
                  <PackageCheck size={14} color="#FB8C00" />
                  <Text className="text-sm text-orange-600 font-medium">Production Qty</Text>
                </HStack>
                <Text className="text-base font-bold">{item.xqtyprd} {item.xunit}</Text>
              </VStack>
              
              <VStack alignItems="center" className="flex-1">
                <HStack space="xs" alignItems="center">
                  <BarChart2 size={14} color="#FB8C00" />
                  <Text className="text-sm text-orange-600 font-medium">Current Stock</Text>
                </HStack>
                <Text 
                  className={`text-base font-bold ${
                    item.stock === 0 ? 'text-red-600' : 
                    item.stock < 20 ? 'text-orange-600' : 
                    'text-gray-800'
                  }`}
                >
                  {item.stock} {item.xunit}
                </Text>
              </VStack>
              
              <VStack alignItems="center" className="flex-1">
                <HStack space="xs" alignItems="center">
                  <DollarSign size={14} color="#FB8C00" />
                  <Text className="text-sm text-orange-600 font-medium">Cost</Text>
                </HStack>
                <Text className="text-base font-bold text-orange-600">৳{item.mo_cost}</Text>
              </VStack>
            </HStack>
            
            {/* Last MO Details */}
            <HStack space="md" justifyContent="space-between" className="mt-1 border-t border-gray-100 pt-2">
              <HStack alignItems="center" className="flex-1">
                <Text className="text-sm text-gray-500">Last Production: </Text>
                {item.last_mo_number ? (
                  <Pressable onPress={handleLastMODetails}>
                    <Text className="text-sm text-blue-500 font-medium underline">{item.last_mo_number}</Text>
                  </Pressable>
                ) : (
                  <Text className="text-sm text-gray-500">None</Text>
                )}
              </HStack>
              
              <Text className="text-sm text-gray-500">{formatDate(item.last_mo_date)}</Text>
              
              <Text className="text-sm text-gray-700 font-medium">{item.last_mo_qty} {item.xunit}</Text>
            </HStack>
            
            {/* Action Buttons */}
            <HStack space="md" className="mt-3">
              <Button 
                size="sm"
                variant="outline"
                className="flex-1 border-orange-500"
                onPress={handleViewDetails}
              >
                <FileText size={16} color="#FB8C00" className="mr-1" />
                <ButtonText className="text-orange-500">Details</ButtonText>
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 border-green-500"
                onPress={handleExport}
              >
                <Download size={16} color="#22c55e" className="mr-1" />
                <ButtonText className="text-green-500">Export</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Pressable>
    </Animated.View>
  );
};

export default ManufacturingItemCard;
