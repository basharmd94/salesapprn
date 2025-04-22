import React, { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { ScrollView, StyleSheet, Dimensions, ActivityIndicator, Platform, Share, Linking, View } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, MapPin, Navigation, Share2, Compass } from 'lucide-react-native';
import * as Location from 'expo-location';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from "@/context/AuthContext";
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function LocationScreen() {
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);

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
        
        // Set the map region based on current location
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
        
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
      
      // Update map region
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      
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
        {/* Map Card */}
        <Card className="bg-white rounded-2xl p-4 mb-2">
          <VStack space="md">
            <HStack className="items-center mb-2">
              <Box className="bg-orange-400 p-2 rounded-lg mr-3">
                <Compass size={24} color="#fff" />
              </Box>
              <Heading size="md">Location Map</Heading>
            </HStack>
            
            {mapRegion && (
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  region={mapRegion}
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  showsCompass={true}
                  toolbarEnabled={true}
                >
                  <Marker
                    coordinate={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }}
                    title={address?.name || "My Location"}
                    description={address ? [
                      address.street,
                      address.city,
                      address.region,
                      address.country
                    ].filter(Boolean).join(", ") : "Current Position"}
                    pinColor="#f97316"
                  />
                </MapView>
              </View>
            )}
          </VStack>
        </Card>

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
            <ButtonText>Share to WhatsApp</ButtonText>
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

const styles = StyleSheet.create({
  mapContainer: {
    height: 300,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});