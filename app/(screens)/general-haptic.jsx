import React, { useState, useCallback } from 'react';
import { 
  SafeAreaView, 
  ActivityIndicator, 
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  Text
} from "react-native";
import { router } from "expo-router";
import { ArrowLeft, MessageSquare, User, Package, Send, CheckSquare, Square, Check, AlertCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { createFeedback } from '@/lib/api_feedback';
import { useToast, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

// Checkbox component
const Checkbox = ({ label, value, onValueChange }) => {
  return (
    <TouchableOpacity
      className="flex-row items-center"
      onPress={() => onValueChange(!value)}
    >
      {value ? (
        <CheckSquare size={24} color="#f97316" />
      ) : (
        <Square size={24} color="#6b7280" />
      )}
      <Text className="ml-2 text-sm text-gray-700">{label}</Text>
    </TouchableOpacity>
  );
};

export default function GeneralHaptic() {
  const { user } = useAuth();
  const toast = useToast();
    // State for form fields
  const [customerId, setCustomerId] = useState('');
  const [productId, setProductId] = useState('');
  const [isCollectionIssue, setIsCollectionIssue] = useState(false);
  const [isDeliveryIssue, setIsDeliveryIssue] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  
  // State for form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  // Show toast notification
  const showToast = useCallback((type, message) => {
    const id = Math.random();
    toast.show({
      id,
      placement: 'top',
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action={type} variant="solid">
            <VStack space="xs">
              <HStack space="sm" alignItems="center">
                {type === 'success' ? (
                  <Check size={18} className="text-white" />
                ) : (
                  <AlertCircle size={18} className="text-white" />
                )}
                <ToastTitle>{type === 'success' ? 'Success' : 'Error'}</ToastTitle>
              </HStack>
              <ToastDescription>{message}</ToastDescription>
            </VStack>
          </Toast>
        );
      },
    });
  }, [toast]);  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      setError('Please provide feedback description');
      showToast('error', 'Please provide feedback description');
      return;
    }
    
    if (!user?.businessId) {
      setError('User business ID not available');
      showToast('error', 'User business ID not available');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const feedbackData = {
        zid: Number(user.businessId),
        customer_id: customerId.trim(),
        product_id: productId.trim(),
        is_delivery_issue: isDeliveryIssue,
        is_collection_issue: isCollectionIssue,
        description: feedbackText,
        user_id: user?.id || user?.user_id || ''
      };
      
      await createFeedback(feedbackData);
      showToast('success', 'Feedback submitted successfully!');
      
      // Reset form fields
      setFeedbackText('');
      setProductId('');
      setCustomerId('');
      setIsCollectionIssue(false);
      setIsDeliveryIssue(false);
      
    } catch (error) {
      console.error('Feedback submission error:', error);
      setError('Failed to submit feedback. Please try again.');
      showToast('error', 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">Haptic Feedback</Text>
          <Text className="text-sm text-gray-600 mt-0.5">Submit detailed feedback for issues</Text>
        </View>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Animated.ScrollView 
          entering={FadeInDown.duration(300)}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Feedback Form */}
          <View className="bg-white m-4 rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center mb-4">
              <MessageSquare size={18} color="#f97316" />
              <Text className="text-base font-semibold text-gray-900 ml-2">Submit Haptic Feedback</Text>
            </View>

            {/* Customer ID */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1.5">Customer ID</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5">
                <User size={16} color="#6b7280" />
                <TextInput
                  className="flex-1 text-sm text-gray-900 ml-2"
                  value={customerId}
                  onChangeText={setCustomerId}
                  placeholder="Enter customer ID"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
            
            {/* Product ID */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1.5">Product ID</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5">
                <Package size={16} color="#6b7280" />
                <TextInput
                  className="flex-1 text-sm text-gray-900 ml-2"
                  value={productId}
                  onChangeText={setProductId}
                  placeholder="Enter product ID"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
            
            {/* Issues Checkboxes */}
            <View className="flex-row justify-between mb-4">
              <Checkbox 
                label="Collection Issue" 
                value={isCollectionIssue} 
                onValueChange={setIsCollectionIssue} 
              />
              
              <Checkbox 
                label="Delivery Issue" 
                value={isDeliveryIssue} 
                onValueChange={setIsDeliveryIssue} 
              />
            </View>
            
            {/* Feedback Description */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Feedback Description</Text>
              <TextInput 
                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 min-h-[150px] max-h-[300px]"
                placeholder="Enter your feedback here..."
                placeholderTextColor="#9ca3af"
                multiline={true}
                textAlignVertical="top"
                value={feedbackText}
                onChangeText={setFeedbackText}
                numberOfLines={8}
                returnKeyType="default"
                blurOnSubmit={false}
              />
              <Text className="text-xs text-gray-500 mt-1 text-right">{feedbackText.length} characters</Text>
            </View>
            
            {/* Submit Button */}            
            <TouchableOpacity 
              className="bg-orange-500 rounded-lg py-3 flex-row justify-center items-center"
              onPress={handleSubmitFeedback}
              disabled={submitting || !feedbackText.trim()}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Send size={16} color="#fff" />
                  <Text className="text-white font-semibold ml-2">Submit Feedback</Text>
                </>
              )}
            </TouchableOpacity>
            
            {error && <Text className="text-red-500 mt-2 text-center">{error}</Text>}
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}