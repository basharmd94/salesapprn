import React, { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { ScrollView, TouchableOpacity } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText, ButtonIcon, ButtonSpinner } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallbackText } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { LogOut, Mail, Phone, Building, Terminal, Shield, Database, Package, MapPin } from 'lucide-react-native';
import { Alert, AlertText, AlertIcon } from "@/components/ui/alert";
import { InfoIcon } from "@/components/ui/icon";
import { router, usePathname } from "expo-router";
import AnimatedPageTransition from '@/components/AnimatedPageTransition';
import colors from "tailwindcss/colors";
import syncCustomers from '@/utils/syncCustomer';
import syncItems from '@/utils/syncItems';

const ProfileItem = ({ icon: Icon, label, value }) => (
  <HStack space="md" className="items-center py-3">
    <Box className="bg-orange-400 p-2 rounded-lg">
      <Icon size={20} color="#fff" />
    </Box>
    <VStack>
      <Text className="text-gray-500 text-sm">{label}</Text>
      <Text className="text-gray-900 font-medium">{value}</Text>
    </VStack>
  </HStack>
);

const ActionButton = ({ icon: Icon, label, onPress, isLoading, color }) => (
  <TouchableOpacity 
    onPress={onPress} 
    disabled={isLoading}
    className="items-center justify-center"
  >
    <Box 
      className={`w-16 h-16 rounded-full items-center justify-center ${color}`}
    >
      {isLoading ? (
        <ButtonSpinner color={colors.white} />
      ) : (
        <Icon size={25} color="#fff" />
      )}
    </Box>
    <Text className="text-xs text-gray-700 mt-2 font-medium text-center">
      {isLoading ? 'Syncing...' : label}
    </Text>
  </TouchableOpacity>
);

export default function Profile() {
  const { user, logout } = useAuth();
  const [isSyncingCustomers, setIsSyncingCustomers] = useState(false);
  const [isSyncingItems, setIsSyncingItems] = useState(false);
  const [syncAlert, setSyncAlert] = useState({ show: false, message: '' });
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const handleSyncCustomers = async () => {
    if (!user?.user_id) {
      console.error('No employee ID available for sync');
      return;
    }
    setIsSyncingCustomers(true);
    setSyncAlert({ show: false, message: '' });
    try {
      const result = await syncCustomers(user.user_id);
      if (result.success) {
        let message = result.message;
        if (!message) {
          if (result.totalCustomers === -1) {
            message = 'Customer sync completed successfully';
          } else {
            message = `Customer Sync Completed: ${result.updatedCustomers} customers updated out of ${result.totalCustomers} total customers`;
          }
        }
        setSyncAlert({ show: true, message });
      }
    } catch (error) {
      console.error('Customer sync failed:', error);
      setSyncAlert({ show: true, message: 'Customer Sync Failed!' });
    } finally {
      setIsSyncingCustomers(false);
    }
  };

  const handleSyncItems = async () => {
    setIsSyncingItems(true);
    setSyncAlert({ show: false, message: '' });
    try {
      const result = await syncItems();
      if (result.success) {
        let message = result.message;
        if (!message) {
          if (result.totalItems === -1) {
            message = 'Item sync completed successfully';
          } else {
            message = `Items Sync Completed: ${result.updatedItems} items updated out of ${result.totalItems} total items`;
          }
        }
        setSyncAlert({ show: true, message });
      }
    } catch (error) {
      console.error('Items sync failed:', error);
      setSyncAlert({ show: true, message: 'Items Sync Failed!' });
    } finally {
      setIsSyncingItems(false);
    }
  };

  if (!isReady) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Box className="p-4 items-center">
          <Avatar size="lg" className="bg-orange-400 mb-2">
            <AvatarFallbackText>
              {getInitials(user?.username || 'User')}
            </AvatarFallbackText>
          </Avatar>
          <Text className="mt-2 text-gray-500">Loading profile...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AnimatedPageTransition animation="slideUp" duration={400}>
        <ScrollView>
          <Box className="p-4">
            <AnimatedPageTransition animation="fade" delay={100} duration={400}>
              <Box className="items-center mb-4">
                <Avatar size="2xl" className="bg-orange-400 mb-4">
                  <AvatarFallbackText>
                    {getInitials(user?.username || 'User')}
                  </AvatarFallbackText>
                </Avatar>
                <Heading size="xl" className="text-gray-900">
                  {user?.username || 'User'}
                </Heading>
                <Text className="text-gray-500 mt-1 mb-4">
                  Employee ID: {user?.user_id || 'N/A'}
                </Text>
                
                {/* Action buttons */}
                <AnimatedPageTransition animation="slideIn" delay={150} duration={400}>
                  <Box className="w-full">
                    <HStack space="lg" className="justify-center mb-4">
                      <ActionButton 
                        icon={Package} 
                        label="Sync Items" 
                        onPress={handleSyncItems}
                        isLoading={isSyncingItems}
                        color="bg-emerald-500"
                      />

                      <ActionButton 
                        icon={Database} 
                        label="Sync Customers" 
                        onPress={handleSyncCustomers}
                        isLoading={isSyncingCustomers}
                        color="bg-orange-400"
                      />

                      <ActionButton 
                        icon={MapPin} 
                        label="My Location" 
                        onPress={() => router.push('/location')}
                        color="bg-blue-500"
                      />

                      <ActionButton 
                        icon={LogOut} 
                        label="Logout" 
                        onPress={logout}
                        color="bg-gray-800"
                      />
                    </HStack>
                  </Box>
                </AnimatedPageTransition>
              </Box>
            </AnimatedPageTransition>

            <AnimatedPageTransition animation="slideUp" delay={200} duration={400}>
              <Card className="bg-white rounded-2xl p-4 mb-4">
                <VStack space="xs">
                  <Text className="text-gray-900 font-medium mb-2">Profile Information</Text>
                  <ProfileItem 
                    icon={Mail} 
                    label="Email Address" 
                    value={user?.email || 'Not provided'} 
                  />
                  <Divider />
                  <ProfileItem 
                    icon={Phone} 
                    label="Mobile Number" 
                    value={user?.mobile || 'Not provided'} 
                  />
                  <Divider />
                  <ProfileItem 
                    icon={Building} 
                    label="Business ID" 
                    value={user?.businessId || 'Not assigned'} 
                  />
                  <Divider />
                  <ProfileItem 
                    icon={Terminal} 
                    label="Terminal" 
                    value={user?.terminal || 'Not assigned'} 
                  />
                  <Divider />
                  <ProfileItem 
                    icon={Shield} 
                    label="Role" 
                    value={user?.is_admin === 'admin' ? 'Administrator' : 'User'} 
                  />
                </VStack>
              </Card>

              {/* Sync Alert */}
              {syncAlert.show && (
                <AnimatedPageTransition animation="fade" duration={300}>
                  <Alert action="info" variant="solid" className="mb-4">
                    <AlertIcon as={InfoIcon} />
                    <AlertText>{syncAlert.message}</AlertText>
                  </Alert>
                </AnimatedPageTransition>
              )}
            </AnimatedPageTransition>
          </Box>
        </ScrollView>
      </AnimatedPageTransition>
    </SafeAreaView>
  );
}