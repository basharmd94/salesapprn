import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  ActivityIndicator, 
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, MessageSquare, Send, CheckSquare, Square } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { createFeedback } from '@/lib/api_feedback';

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

export default function GeneralFeedbackScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  // State for feedback form
  const [submitting, setSubmitting] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isAppIssue, setIsAppIssue] = useState(false);
  const [isFeatureRequest, setIsFeatureRequest] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      setError('Please provide feedback description');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const feedbackData = {
        description: feedbackText,
        is_app_issue: isAppIssue,
        is_feature_request: isFeatureRequest,
        user_id: user?.id || user?.user_id || ''
      };
      
      await createFeedback(feedbackData);
      setFeedbackText('');
      setIsAppIssue(false);
      setIsFeatureRequest(false);
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Feedback submission error:', error);
      setError('Failed to submit feedback. Please try again.');
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
          <Text className="text-lg font-semibold text-gray-900">General Feedback</Text>
          <Text className="text-sm text-gray-600 mt-0.5">
            Help us improve our app
          </Text>
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
              <Text className="text-base font-semibold text-gray-900 ml-2">Submit Feedback</Text>
            </View>

            <View className="flex-row justify-between mb-4">
              <Checkbox 
                label="App Issue" 
                value={isAppIssue} 
                onValueChange={setIsAppIssue} 
              />
              
              <Checkbox 
                label="Feature Request" 
                value={isFeatureRequest} 
                onValueChange={setIsFeatureRequest} 
              />
            </View>
            
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
            {success && <Text className="text-green-500 mt-2 text-center">Feedback submitted successfully!</Text>}
          </View>
          
          {/* Information card */}
          <View className="bg-white m-4 mt-0 rounded-xl p-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-900 mb-2">Why Your Feedback Matters</Text>
            <Text className="text-sm text-gray-600 mb-2">
              We continuously strive to improve our application based on your valuable input. Your feedback helps us:
            </Text>
            <View className="ml-4">
              <Text className="text-sm text-gray-600 mb-1">• Fix bugs and issues</Text>
              <Text className="text-sm text-gray-600 mb-1">• Develop new features</Text>
              <Text className="text-sm text-gray-600 mb-1">• Improve user experience</Text>
              <Text className="text-sm text-gray-600">• Make better business decisions</Text>
            </View>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}