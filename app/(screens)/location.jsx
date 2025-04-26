import React, { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { ScrollView, Dimensions, ActivityIndicator, Platform, Share, Linking, View, Alert } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, MapPin, Navigation, Share2, Upload, CheckCircle, Server, AlertTriangle } from 'lucide-react-native';
import * as Location from 'expo-location';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from "@/context/AuthContext";
import { sendLocation } from '@/lib/api_location';
import { getLocationRequestsInfo, incrementLocationRequest } from '@/utils/locationLimiter';

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
  
  // Fetch location request count on component mount
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
        
        // Get reverse geocoding to find the address
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
      
      // Get reverse geocoding to find the address
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
      // Format full address for sharing
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

      // Create Google Maps link with coordinates
      const googleMapsUrl = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
      
      // Create message with location info
      const message = `📍 My Current Location:\n\n📌 Coordinates: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}\n\n📍 ${formattedAddress}\n\n📲 View on Maps: ${googleMapsUrl}`;

      // Share via system share sheet (works with WhatsApp and other apps)
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
      // Create Google Maps link with coordinates
      const googleMapsUrl = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
      
      // Format the address for sharing
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
      
      // Create message with location info
      const message = `📍 My Current Location:\n\n📌 Coordinates: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}\n\n📍 ${formattedAddress}\n\n📲 View on Maps: ${googleMapsUrl}`;
      
      // Encode the message for a URL
      const encodedMessage = encodeURIComponent(message);
      
      // Create WhatsApp deep link
      const whatsappUrl = `whatsapp://send?text=${encodedMessage}`;
      
      // Open WhatsApp with the location message
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
      // Check if we have any requests remaining for today
      const result = await incrementLocationRequest();
      
      if (!result.success) {
        Alert.alert(
          'Daily Limit Reached',
          `You've reached the maximum of 6 location updates per day. Limit will reset in ${result.resetTime}.`,
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Update the requests info state
      setRequestsInfo({
        remaining: result.remaining,
        resetTime: result.resetTime
      });
      
      setSendingToAPI(true);
      setApiSendSuccess(false);
      
      // Format address for API
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

      // Create Google Maps link
      const googleMapsUrl = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
      
      // Prepare data for API according to required schema
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
      
      // Send to API
      const response = await sendLocation(locationData);
      
      // Handle success
      console.log('Location saved successfully:', response);
      setApiSendSuccess(true);
      
      // Show success message to user
      Alert.alert(
        'Location Saved', 
        `Your location has been successfully saved to the server. You have ${result.remaining} updates remaining today.`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Error sending location to API:', error);
      
      // Show error message to user
      Alert.alert(
        'Error', 
        `Failed to save your location: ${error.message}`,
        [{ text: 'OK' }]
      );
      
      // Refresh request count in case of error
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
          className="bg-orange-500"
          size="lg"
        >
          <ButtonIcon as={RefreshCw} className="mr-2 text-white" />
          <ButtonText>Try Again</ButtonText>
        </Button>
      </Box>
    );
  } else if (location) {
    locationContent = (
      <VStack space="lg" className="p-4">
        <Card className="bg-white rounded-2xl p-6 mb-2">
          <VStack space="md">
            <HStack className="items-center mb-2">
              <Box className="bg-orange-400 p-2 rounded-lg mr-3">
                <MapPin size={24} color="#fff" />
              </Box>
              <Heading size="md">Current Location</Heading>
            </HStack>
            
            <VStack space="xs">
              <HStack className="justify-between">
                <Text className="text-gray-500">Latitude:</Text>
                <Text className="font-medium">{location.coords.latitude.toFixed(6)}</Text>
              </HStack>
              
              <HStack className="justify-between">
                <Text className="text-gray-500">Longitude:</Text>
                <Text className="font-medium">{location.coords.longitude.toFixed(6)}</Text>
              </HStack>
              
              <HStack className="justify-between">
                <Text className="text-gray-500">Altitude:</Text>
                <Text className="font-medium">
                  {location.coords.altitude ? `${location.coords.altitude.toFixed(2)} meters` : 'Not available'}
                </Text>
              </HStack>
              
              <HStack className="justify-between">
                <Text className="text-gray-500">Accuracy:</Text>
                <Text className="font-medium">{location.coords.accuracy.toFixed(2)} meters</Text>
              </HStack>
              
              <HStack className="justify-between">
                <Text className="text-gray-500">Last Updated:</Text>
                <Text className="font-medium">{new Date(location.timestamp).toLocaleTimeString()}</Text>
              </HStack>
            </VStack>
          </VStack>
        </Card>

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
        
        {/* Sharing and Refresh Buttons */}
        <HStack space="md" className="justify-center mt-2">
          <Button 
            onPress={refreshLocation} 
            variant="solid" 
            className="bg-orange-500 flex-1"
            size="lg"
          >
            <ButtonIcon as={RefreshCw} className="mr-2 text-white" />
            <ButtonText>Refresh</ButtonText>
          </Button>
          
          <Button 
            onPress={shareToWhatsApp} 
            variant="solid" 
            className="bg-green-600 flex-1"
            size="lg"
          >
            <ButtonIcon as={Share2} className="mr-2 text-white" />
            <ButtonText>WhatsApp</ButtonText>
          </Button>
        </HStack>
        
        <Button 
          onPress={shareLocation} 
          variant="outline" 
          className="border-gray-300"
          size="lg"
        >
          <ButtonIcon as={Share2} className="mr-2 text-gray-700" />
          <ButtonText className="text-gray-700">Share via Other Apps</ButtonText>
        </Button>

        {/* Send Location to API with Daily Limit Info */}
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
            
            <Button 
              onPress={sendLocationToAPI} 
              variant="solid" 
              className={requestsInfo.remaining > 0 ? "bg-blue-600" : "bg-gray-400"}
              size="lg"
              disabled={sendingToAPI || requestsInfo.remaining <= 0}
            >
              {sendingToAPI ? (
                <HStack space="sm" className="items-center">
                  <ActivityIndicator size="small" color="white" />
                  <ButtonText>Sending...</ButtonText>
                </HStack>
              ) : (
                <>
                  <ButtonIcon as={Upload} className="mr-2 text-white" />
                  <ButtonText>
                    {requestsInfo.remaining > 0 ? 
                      `Send Location (${requestsInfo.remaining} remaining)` : 
                      "Daily Limit Reached"}
                  </ButtonText>
                </>
              )}
            </Button>
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
          <VStack space="md" className="items-center mb-6">
            <MapPin size={60} color="#f97316" />
            <Heading size="xl" className="text-center">Your Location</Heading>
            <Text className="text-gray-500 text-center px-6">
              View your current geographical location and address information
            </Text>
          </VStack>
          
          {locationContent}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}