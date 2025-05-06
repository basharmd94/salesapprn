import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Trash2, ShoppingCart, DollarSign, Hash } from "lucide-react-native";
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  runOnJS,
  SlideInDown,
  SlideOutDown
} from 'react-native-reanimated';

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function CartItem({ item, onRemove }) {
  const handleRemove = () => {
    runOnJS(onRemove)(item);
  };

  return (
    <AnimatedBox
      className="group overflow-visible"
      entering={SlideInDown.springify().damping(12)}
      exiting={SlideOutDown.springify().damping(12)}
    >
      <HStack
        justifyContent="space-between"
        alignItems="center"
        className="p-3 bg-white rounded-lg "
      >
        <VStack space="2" flex={1}>
          <Text className="text-md font-bold text-black italic">
            Code: {item.xitem}
          </Text>
          <Text className="text-md font-semibold text-primary-400 mb-2 ">
            {item.xdesc.length > 30 ? item.xdesc.substring(0, 30) + "..." : item.xdesc}
          </Text>
          <HStack space="3" alignItems="center" flexWrap="wrap">
            <Box className="bg-warning-400 px-2.5 py-1 rounded-full">
              <HStack space="1" alignItems="center">
                <ShoppingCart size={12} color="#1e40af" />
                <Text className="text-md font-medium text-primary-800">
                  Qty: {item.xqty}
                </Text>
              </HStack>
            </Box>
            <Text className="text-orange-400"> ➞ </Text>
            <Box className="bg-green-50 px-2.5 py-1 rounded-full">
              <HStack space="1" alignItems="center">
                <DollarSign size={12} color="#166534" />
                <Text className="text-md font-medium text-green-800">
                  Unit: ৳{item.xprice}
                </Text>
              </HStack>
            </Box>
            <Text className="text-orange-400"> ➞ </Text>
            <Box className="bg-purple-50 px-2.5 py-1 rounded-full">
              <HStack space="1" alignItems="center">
                <Hash size={12} color="#581c87" />
                <Text className="text-md font-bold text-purple-900">
                  Total: ৳{item.xlinetotal}
                </Text>
              </HStack>
            </Box>
          </HStack>
        </VStack>

        <Button
          variant="ghost"
          action="error"
          onPress={handleRemove}
          className="opacity-80 hover:opacity-100 active:scale-95 transition-all ml-auto border-none bg-primary-50/0 group-hover:bg-primary-50/20"
        >
          <ButtonIcon as={Trash2} size="md" className="text-red-600" />
        </Button>
      </HStack>
    </AnimatedBox>
  );
}