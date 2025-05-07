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
      
      <Input size="md" variant="rounded" className = 'border h-10 border-primary-50 rounded-2xl'>
        <InputField
          placeholder="Enter quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          disabled={disabled}    
          className = "text-primary-400 text-md font-semibold flex-1"    
          
          
        />

            <InputSlot className="flex justify-center items-center">
              <Plus className="w-4 h-4 text-gray-500 mr-6" />
            </InputSlot>
            

      </Input>
    </Box>
  );
} 