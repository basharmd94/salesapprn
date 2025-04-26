import React from 'react';
import { Platform, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Quick Action Card Component
 * Similar to ManagementCard but can have different styling for quick actions
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the card
 * @param {Component} props.icon - The icon component to display
 * @param {Function} props.onPress - Function to call when the card is pressed
 * @param {string} props.subtitle - Optional subtitle text
 * @param {string[]} props.gradientColors - Array of gradient colors
 */
const QuickActionCard = ({ 
  title, 
  icon: Icon, 
  subtitle, 
  onPress, 
  gradientColors = ['#4c669f', '#3b5998', '#192f6a'] 
}) => {
  return (
    <View style={{ flex: 1 }}>
      <Button
        variant="unstyled"
        onPress={onPress}
        className="p-0 h-[90px] overflow-hidden rounded-2xl"
        style={{
          elevation: Platform.OS === 'android' ? 4 : 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <LinearGradient
          colors={gradientColors}
          start={[0, 0]}
          end={[1, 1]}
          className="w-full h-full justify-center items-center rounded-2xl p-4"
        >
          <VStack className="items-center space-y-1">
            <Icon size={26} color="white" />
            <Text className="text-white font-semibold text-sm">{title}</Text>
            {subtitle && (
              <Text className="text-white/80 text-xs">{subtitle}</Text>
            )}
          </VStack>
        </LinearGradient>
      </Button>
    </View>
  );
};

export default QuickActionCard;