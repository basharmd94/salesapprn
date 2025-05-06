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
      <Stack.Screen 
        name="fetch_items"
        options={{
          headerShown: false,
          animation: "slide_from_right"
        }}
      />
      <Stack.Screen 
        name="customer-profile"
        options={{
          headerShown: false,
          animation: "slide_from_right"
        }}
      />
      <Stack.Screen 
        name="customer-balance" 
        options={{ 
          title: "Customer Balance",
          headerBackTitleVisible: false,
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="customer-feedback" 
        options={{ 
          headerShown: false,
          title: "Customer Feedback",
          headerBackTitleVisible: false,
          animation: "slide_from_right"
        }} 
      />
      {/* <Stack.Screen 
        name="customer-analysis" 
        options={{ 
          title: "Customer Analysis",
          headerBackTitleVisible: false,
          animation: "slide_from_right"
        }} 
      /> */}
      {/* <Stack.Screen 
        name="customer-balance-details" 
        options={{ 
          title: "Balance Details",
          headerBackTitleVisible: false,
          animation: "slide_from_right"
        }} 
      /> */}
    </Stack>
  );
}