import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputSlot  } from "@/components/ui/input";
import { Plus } from "lucide-react-native";


export default function QuantityInput({
  quantity,
  setQuantity,
  disabled
}) {
  return (
    <Box>
      <Text className="text-primary-800 text-md pb-2">Quantity</Text>
      <Input size="md" variant="rounded" className = 'border h-14 border-primary-50 rounded-2xl'>
        <InputField
          placeholder="Enter quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          disabled={disabled}    
          className = "text-primary-400 text-lg font-semibold flex-1"    
          
          
        />

            <InputSlot className="flex justify-center items-center">
              <Plus className="w-4 h-4 text-gray-500 mr-6" />
            </InputSlot>
            

      </Input>
    </Box>
  );
} 