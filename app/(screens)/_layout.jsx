import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="new-order" 
        options={{ 
          title: "Orders Sent",
          headerBackTitleVisible: false,
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="confirm-order" 
        options={{ 
          title: "Confirmed Orders",
          headerBackTitleVisible: false,
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="cancel-order" 
        options={{ 
          title: "Canceled Orders",
          headerBackTitleVisible: false,
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="location" 
        options={{ 
          title: "My Location",
          headerBackTitleVisible: false,
          animation: "slide_from_right"
        }} 
      />
    </Stack>
  );
}