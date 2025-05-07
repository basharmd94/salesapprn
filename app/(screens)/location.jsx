import React, { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { ScrollView, Dimensions, ActivityIndicator, Platform, Share, Linking, View, Alert } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, MapPin, Navigation, Share2, Upload, CheckCircle, Server, AlertTriangle, Send } from 'lucide-react-native';
import * as Location from 'expo-location';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from "@/context/AuthContext";
import { sendLocation } from '@/lib/api_location';
import { getLocationRequestsInfo, incrementLocationRequest } from '@/utils/locationLimiter';
import { Badge, BadgeText } from "@/components/ui/badge";

const { width, height } = Dimensions.get('window');

export default function LocationScreen() {
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const [sendingToAPI, setSendingToAPI] = useState(false);
  const [apiSendSuccess, setApiSendSuccess] = useState(false);
  const [requestsInfo, setRequestsInfo] = useState({ remaining: 0, resetTime: "24h 0m" });
  
  useEffect(() => {
    const loadRequestsInfo = async () => {
      const info = await getLocationRequestsInfo();
      setRequestsInfo(info);
    };
    
    loadRequestsInfo();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(location);
        
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        if (addressResponse && addressResponse.length > 0) {
          setAddress(addressResponse[0]);
        }
      } catch (err) {
        setErrorMsg('Error fetching location: ' + err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refreshLocation = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(location);
      
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (addressResponse && addressResponse.length > 0) {
        setAddress(addressResponse[0]);
      }
    } catch (err) {
      setErrorMsg('Error refreshing location: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const shareLocation = async () => {
    if (!location) return;

    try {
      let formattedAddress = "";
      if (address) {
        const addressParts = [];
        if (address.name) addressParts.push(address.name);
        if (address.street) addressParts.push(address.street);
        if (address.district) addressParts.push(address.district);
        if (address.city) addressParts.push(address.city);
        if (address.region) addressParts.push(address.region);
        if (address.country) addressParts.push(address.country);
        
        formattedAddress = addressParts.join(", ");
      }

      const googleMapsUrl = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
      
      const message = `📍 My Current Location:\n\n📌 Coordinates: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}\n\n📍 ${formattedAddress}\n\n📲 View on Maps: ${googleMapsUrl}`;

      await Share.share({
        message: message,
        title: "My Location"
      });
    } catch (error) {
      console.error("Error sharing location:", error);
    }
  };

  const shareToWhatsApp = () => {
    if (!location) return;

    try {
      const googleMapsUrl = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
      
      let formattedAddress = "";
      if (address) {
        const addressParts = [];
        if (address.name) addressParts.push(address.name);
        if (address.street) addressParts.push(address.street);
        if (address.district) addressParts.push(address.district);
        if (address.city) addressParts.push(address.city);
        if (address.region) addressParts.push(address.region);
        if (address.country) addressParts.push(address.country);
        
        formattedAddress = addressParts.join(", ");
      }
      
      const message = `📍 My Current Location:\n\n📌 Coordinates: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}\n\n📍 ${formattedAddress}\n\n📲 View on Maps: ${googleMapsUrl}`;
      
      const encodedMessage = encodeURIComponent(message);
      
      const whatsappUrl = `whatsapp://send?text=${encodedMessage}`;
      
      Linking.openURL(whatsappUrl).catch(err => {
        console.error('WhatsApp is not installed or could not be opened', err);
      });
    } catch (error) {
      console.error("Error sharing to WhatsApp:", error);
    }
  };

  const sendLocationToAPI = async () => {
    if (!location || !user) return;
    
    try {
      const result = await incrementLocationRequest();
      
      if (!result.success) {
        Alert.alert(
          'Daily Limit Reached',
          `You've reached the maximum of 6 location updates per day. Limit will reset in ${result.resetTime}.`,
          [{ text: 'OK' }]
        );
        return;
      }
      
      setRequestsInfo({
        remaining: result.remaining,
        resetTime: result.resetTime
      });
      
      setSendingToAPI(true);
      setApiSendSuccess(false);
      
      let formattedAddress = "";
      if (address) {
        const addressParts = [];
        if (address.name) addressParts.push(address.name);
        if (address.street) addressParts.push(address.street);
        if (address.district) addressParts.push(address.district);
        if (address.city) addressParts.push(address.city);
        if (address.region) addressParts.push(address.region);
        if (address.country) addressParts.push(address.country);
        
        formattedAddress = addressParts.join(", ");
      }

      const googleMapsUrl = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
      
      const locationData = {
        username: user.username,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude || 0,
        accuracy: location.coords.accuracy,
        name: address?.name || "",
        street: address?.street || "",
        district: address?.district || "",
        city: address?.city || "",
        region: address?.region || "",
        postal_code: address?.postalCode || "",
        country: address?.country || "",
        formatted_address: formattedAddress,
        maps_url: googleMapsUrl,
        timestamp: new Date(location.timestamp).toISOString(),
        business_id: parseInt(user.businessId) || 0,
        notes: `Location recorded from mobile app`,
        device_info: Platform.OS,
        is_check_in: true,
        shared_via: "Mobile App"
      };
      
      const response = await sendLocation(locationData);
      
      console.log('Location saved successfully:', response);
      setApiSendSuccess(true);
      
      Alert.alert(
        'Location Saved', 
        `Your location has been successfully saved to the server. You have ${result.remaining} updates remaining today.`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Error sending location to API:', error);
      
      Alert.alert(
        'Error', 
        `Failed to save your location: ${error.message}`,
        [{ text: 'OK' }]
      );
      
      const info = await getLocationRequestsInfo();
      setRequestsInfo(info);
    } finally {
      setSendingToAPI(false);
    }
  };

  let locationContent;
  
  if (loading) {
    locationContent = (
      <Box className="items-center justify-center p-8">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="text-gray-600 mt-4">Fetching your location...</Text>
      </Box>
    );
  } else if (errorMsg) {
    locationContent = (
      <Box className="items-center justify-center p-8">
        <Box className="bg-red-100 p-4 rounded-xl mb-4 w-full">
          <Text className="text-red-600">{errorMsg}</Text>
        </Box>
        <Button 
          onPress={refreshLocation} 
          variant="solid" 
          className="bg-orange-500 rounded-full h-14 w-14 items-center justify-center"
          size="lg"
        >
          <ButtonIcon as={RefreshCw} color="#fff" />
        </Button>
      </Box>
    );
  } else if (location) {
    locationContent = (
      <VStack space="lg" className="p-4">
        {address && (
          <Card className="bg-white rounded-2xl p-6">
            <VStack space="md">
              <HStack className="items-center mb-2">
                <Box className="bg-orange-400 p-2 rounded-lg mr-3">
                  <Navigation size={24} color="#fff" />
                </Box>
                <Heading size="md">Address Details</Heading>
              </HStack>
              
              <VStack space="xs">
                {address.name && (
                  <HStack className="justify-between">
                    <Text className="text-gray-500">Name:</Text>
                    <Text className="font-medium text-right flex-1 ml-4">{address.name}</Text>
                  </HStack>
                )}
                
                {address.street && (
                  <HStack className="justify-between">
                    <Text className="text-gray-500">Street:</Text>
                    <Text className="font-medium text-right flex-1 ml-4">{address.street}</Text>
                  </HStack>
                )}
                
                {address.district && (
                  <HStack className="justify-between">
                    <Text className="text-gray-500">District:</Text>
                    <Text className="font-medium text-right flex-1 ml-4">{address.district}</Text>
                  </HStack>
                )}
                
                {address.city && (
                  <HStack className="justify-between">
                    <Text className="text-gray-500">City:</Text>
                    <Text className="font-medium text-right flex-1 ml-4">{address.city}</Text>
                  </HStack>
                )}
                
                {address.region && (
                  <HStack className="justify-between">
                    <Text className="text-gray-500">Region:</Text>
                    <Text className="font-medium text-right flex-1 ml-4">{address.region}</Text>
                  </HStack>
                )}
                
                {address.postalCode && (
                  <HStack className="justify-between">
                    <Text className="text-gray-500">Postal Code:</Text>
                    <Text className="font-medium text-right flex-1 ml-4">{address.postalCode}</Text>
                  </HStack>
                )}
                
                {address.country && (
                  <HStack className="justify-between">
                    <Text className="text-gray-500">Country:</Text>
                    <Text className="font-medium text-right flex-1 ml-4">{address.country}</Text>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </Card>
        )}
        
        <HStack space="md" className="justify-center mt-2">
          <Button 
            onPress={refreshLocation} 
            variant="solid" 
            className="bg-orange-500 rounded-full h-14 w-14 items-center justify-center shadow-md"
          >
            <ButtonIcon as={RefreshCw} color="#fff" />
          </Button>
          
          <Button 
            onPress={shareToWhatsApp} 
            variant="solid" 
            className="bg-green-600 rounded-full h-14 w-14 items-center justify-center shadow-md"
          >
            <ButtonIcon as={Share2} color="#fff" />
          </Button>

          <Button 
            onPress={shareLocation} 
            variant="outline" 
            className="border-gray-300 rounded-full h-14 w-14 items-center justify-center shadow-sm"
          >
            <ButtonIcon as={Share2} className="text-gray-700" />
          </Button>
        </HStack>

        <Card className="bg-white rounded-2xl p-5 mt-4">
          <VStack space="sm">
            <HStack className="items-center mb-2">
              <Box className="bg-blue-400 p-2 rounded-lg mr-3">
                <Server size={20} color="#fff" />
              </Box>
              <Heading size="sm">Send Location to Server</Heading>
            </HStack>
            
            <Text className="text-gray-600 mb-2">
              You can send your location to the server up to 6 times per day. 
              {requestsInfo.remaining <= 0 ? 
                ` You've reached your daily limit. Reset in ${requestsInfo.resetTime}.` : 
                ` You have ${requestsInfo.remaining} updates remaining today.`}
            </Text>
            
            {requestsInfo.remaining <= 0 && (
              <HStack className="items-center bg-amber-50 p-3 rounded-xl mb-2">
                <AlertTriangle size={18} color="#f59e0b" className="mr-2" />
                <Text className="text-amber-700 text-sm flex-1">
                  Daily limit reached. Limit will reset at midnight.
                </Text>
              </HStack>
            )}
            
            {apiSendSuccess && (
              <HStack className="items-center bg-green-50 p-3 rounded-xl mb-2">
                <CheckCircle size={18} color="#10b981" className="mr-2" />
                <Text className="text-green-700 text-sm flex-1">
                  Location successfully sent to server.
                </Text>
              </HStack>
            )}
          </VStack>
        </Card>
      </VStack>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View 
          entering={FadeInDown.duration(500).springify()}
          className="p-4"
        >
          <HStack space="md" className="items-center mb-6 bg-white p-4 rounded-2xl shadow-sm">
            <Box className={`p-3 rounded-full ${
              errorMsg ? 'bg-red-100' : 
              loading ? 'bg-amber-100' : 
              'bg-green-100'
            }`}>
              <MapPin size={32} color={
                errorMsg ? '#ef4444' : 
                loading ? '#f59e0b' : 
                '#10b981'
              } />
            </Box>
            <VStack space="xs" flex={1}>
              <Heading size="md">Your Location</Heading>
              <Text className="text-gray-500">
                {errorMsg ? 'Unable to fetch location' : 
                loading ? 'Fetching your location...' : 
                'Location successfully retrieved'}
              </Text>

            </VStack>
            {!loading && !errorMsg && (
              <Box className="bg-green-100 p-2 rounded-full">
                <CheckCircle size={18} color="#10b981" />
              </Box>
            )}
          </HStack>
          
          <Card className="mb-6 bg-gradient-to-r from-orange-500 to-orange-600 p-5 rounded-2xl shadow-md">
            <HStack space="md" alignItems="center" justifyContent="space-between">
              <VStack space="xs">
                <Text className="text-white text-xs opacity-80">STATUS</Text>
                <Text className="text-white font-bold text-lg">
                  {loading ? "Locating..." : 
                   errorMsg ? "Error" : 
                   "Location Found"}
                </Text>
              </VStack>
              <HStack space="xs" alignItems="center">
                <Box className={`h-2.5 w-2.5 rounded-full ${
                  loading ? "bg-white opacity-50" : 
                  errorMsg ? "bg-red-300" : 
                  "bg-green-300"
                }`} />
                <Text className="text-white">
                  {loading ? "Please wait" : 
                   errorMsg ? "Try again" : 
                   "GPS Active"}
                </Text>
              </HStack>
            </HStack>
          </Card>
          
          {locationContent}
        </Animated.View>
      </ScrollView>

      {!loading && !errorMsg && location && (
        <Box className="absolute bottom-6 right-6">
          <Box className="relative">
            <Button 
              size="lg"
              className={`${requestsInfo.remaining > 0 ? "bg-blue-600" : "bg-gray-400"} h-16 w-16 rounded-full items-center justify-center shadow-lg`}
              onPress={sendLocationToAPI}
              disabled={sendingToAPI || requestsInfo.remaining <= 0}
            >
              {sendingToAPI ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Send size={24} color="#fff" />
              )}
            </Button>
            
            {requestsInfo.remaining > 0 && (
              <Badge 
                className="absolute -top-2 -left-2 bg-orange-500 rounded-full min-w-[24px] min-h-[24px] items-center justify-center border-2 border-white z-10 flex"
                size="md"
              >
                <BadgeText className="text-[8px] font-bold text-white text-center leading-none">
                  {requestsInfo.remaining}
                </BadgeText>
              </Badge>
            )}
          </Box>
        </Box>
      )}
    </SafeAreaView>
  );
}