import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

const Index = () => {
  const { loading, user } = useAuth();
  
  // Immediate redirect if user is already logged in
  useEffect(() => {
    if (!loading) {
      if (user) {
        // Using replace instead of push to prevent going back to this screen
        router.replace("/(tabs)/home");
      } else {
        // Using replace instead of push to prevent navigation loop
        router.replace("/sign-in");
      }
    }
  }, [loading, user]);

  // Show spinner while loading
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
};

export default Index;