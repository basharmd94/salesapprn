import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="new-order" 
        options={{ 
          title: "Pending Orders",
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
    </Stack>
  );
}