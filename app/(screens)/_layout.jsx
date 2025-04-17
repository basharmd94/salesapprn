import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="new-order" 
        options={{ 
          title: "New Order",
          headerBackTitleVisible: false,
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="confirm-order" 
        options={{ 
          title: "Confirm Order",
          headerBackTitleVisible: false,
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="cancel-order" 
        options={{ 
          title: "Cancel Order",
          headerBackTitleVisible: false,
          animation: "slide_from_right"
        }} 
      />
    </Stack>
  );
}