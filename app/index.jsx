import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button";
import { useEffect } from "react";

const Index = () => {
  const { loading, user } = useAuth();
  
  // Immediate redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      // Using replace instead of push to prevent going back to this screen
      router.replace("/(tabs)/home");
    }
  }, [loading, user]);

  // Show spinner while loading
  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <Center flex={1}>
          <VStack space="lg" alignItems="center">
            <Spinner size="large" color="$white" />
          </VStack>
        </Center>
        <StatusBar style="light" backgroundColor="#161622" />
      </SafeAreaView>
    );
  }

  // If not logged in, show welcome screen
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">

          <Image
            source={require("@/assets/images/main.png")}
            className="max-w-[380px] w-full h-[250px]"
            resizeMode="contain"
          />

          <View className="relative mt-8">
            <Text className="text-3xl text-gray-800 font-bold text-center">
              Welcome to{"\n"}
              <Text className="text-[#FFA001]">HMBR</Text> Order App
            </Text>
          </View>

          <Text className="text-sm text-orange-500 mt-7 text-center">
            Streamline your orders and boost your business efficiency with our comprehensive order management solution
          </Text>

          <Button
            size="lg"
            variant="solid"
            action="primary"
            onPress={() => router.replace("/sign-in")}
            className="w-full mt-7 rounded-xl bg-gradient-to-r from-[#FFA001] to-[#FF6B00] shadow-md"
          >

          </Button>
        </View>
      </ScrollView>

      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  );
};

export default Index;