import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Link, Stack } from 'expo-router';
import { Image, Dimensions } from 'react-native';
import { Construction, Rocket, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Coming Soon', headerShown: false }} />
      
      <Box className="h-full">
        {/* Top Shape - Decorative element */}
        <Box className="absolute top-0 left-0 right-0">
          <Box className="h-40 bg-orange-500 rounded-b-[50px]" />
        </Box>
        
        <Box className="flex-1 z-10 px-6 pt-8">
          <Animated.View entering={FadeIn.duration(600)}>
            <Link href="/" asChild>
              <Button 
                variant="link" 
                className="self-start p-0 mb-8"
              >
                <ArrowLeft size={20} color="#fff" />
                <ButtonText className="text-white ml-1">Back to Home</ButtonText>
              </Button>
            </Link>
          </Animated.View>

          {/* Main Content */}
          <Animated.View 
            className="items-center justify-center mb-8"
            entering={FadeInDown.duration(800).springify()}
          >
            <Box className="bg-white p-5 rounded-full shadow-lg mb-6">
              <Rocket size={80} color="#FFA500" />
            </Box>
            
            <Heading className="text-center text-3xl font-bold text-gray-800 mb-2">
              Coming Soon!
            </Heading>
            
            <Text className="text-center text-gray-600 text-lg mb-6 max-w-xs">
              We're building something amazing for this route.
            </Text>
            
            <Box className="bg-indigo-50 px-4 py-3 rounded-xl shadow-sm flex-row items-center">
              <Construction size={20} color="#FFA500" />
              <Text className="ml-2 text-orange-500 font-medium">
                Big things are in the works!
              </Text>
            </Box>
          </Animated.View>

          {/* Timeline/Progress */}
          <Animated.View
            className="bg-white rounded-xl p-5 shadow-lg mb-6"
            entering={FadeInDown.delay(200).duration(800).springify()}
          >
            <Heading size="sm" className="text-gray-800 mb-4">Development Timeline:</Heading>
            
            <VStack space="lg">
              <Box className="flex-row">
                <Box className="w-6 h-6 rounded-full bg-green-500 items-center justify-center">
                  <Text className="text-white font-bold">✓</Text>
                </Box>
                <VStack className="ml-3 flex-1">
                  <Text className="text-gray-800 font-medium">Research &amp; Planning</Text>
                  <Text className="text-gray-500 text-xs">Completed April 2025</Text>
                </VStack>
              </Box>
              
              <Box className="flex-row">
                <Box className="w-6 h-6 rounded-full bg-green-500 items-center justify-center">
                  <Text className="text-white font-bold">✓</Text>
                </Box>
                <VStack className="ml-3 flex-1">
                  <Text className="text-gray-800 font-medium">Design Phase</Text>
                  <Text className="text-gray-500 text-xs">Completed April 2025</Text>
                </VStack>
              </Box>
              
              <Box className="flex-row">
                <Box className="w-6 h-6 rounded-full bg-orange-500 items-center justify-center">
                  <Text className="text-white font-medium">⟳</Text>
                </Box>
                <VStack className="ml-3 flex-1">
                  <Text className="text-gray-800 font-medium">Development</Text>
                  <Text className="text-gray-500 text-xs">In Progress (80%)</Text>
                  <Box className="h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                    <Box className="h-full bg-orange-500 rounded-full" style={{ width: '80%' }} />
                  </Box>
                </VStack>
              </Box>
              
            </VStack>
          </Animated.View>
          
          {/* CTA Button */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(800).springify()}
            className="items-center mt-2"
          >
            <Link href="/" asChild>
              <Button 
                size="lg"
                className="bg-orange-500 rounded-xl px-8"
              >
                <ButtonText>Notify Me When It's Ready</ButtonText>
              </Button>
            </Link>
          </Animated.View>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
