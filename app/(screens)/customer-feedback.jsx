import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  ActivityIndicator, 
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  ScrollView
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, MessageSquare, User, Calendar, Send, Phone, BarChart, CheckSquare, Square } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { createFeedback, getCustomerFeedback } from '@/lib/api_feedback';

// Pure React Native Feedback Item component
const FeedbackItem = ({ feedback }) => {
  return (
    <Animated.View entering={FadeIn.delay(200).duration(400)}>
      <View className="border border-gray-200 rounded-lg p-3 mb-3">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs text-gray-500">{feedback.date || feedback.created_at}</Text>
        </View>
        
        <Text className="text-sm text-gray-900 mb-2">{feedback.description}</Text>
        
        {feedback.product_id && (
          <Text className="text-xs text-gray-600 mb-2">Product ID or Name: {feedback.product_id}</Text>
        )}
        
        <View className="flex-row flex-wrap mb-2">
          {feedback.is_collection_issue && (
            <View className="bg-red-100 px-2 py-1 rounded mr-2 mb-1">
              <Text className="text-xs text-red-800">Collection Issue</Text>
            </View>
          )}
          
          {feedback.is_delivery_issue && (
            <View className="bg-red-100 px-2 py-1 rounded mr-2 mb-1">
              <Text className="text-xs text-red-800">Delivery Issue</Text>
            </View>
          )}
        </View>
        
        <View className="h-px bg-gray-200 my-2" />
        
        <View className="flex-row items-center">
          <User size={14} color="#6b7280" />
          <Text className="text-xs text-gray-500 ml-1">Recorded by: {feedback.user_id}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

// Checkbox component
const Checkbox = ({ label, value, onValueChange }) => {
  return (
    <TouchableOpacity
      className="flex-row items-center"
      onPress={() => onValueChange(!value)}
    >
      {value ? (
        <CheckSquare size={24} color="#3b82f6" />
      ) : (
        <Square size={24} color="#6b7280" />
      )}
      <Text className="ml-2 text-sm text-gray-700">{label}</Text>
    </TouchableOpacity>
  );
};

export default function CustomerFeedbackScreen() {
  // Get customer information from route params
  const params = useLocalSearchParams();
  const { xcus, zid, xorg, xmobile } = params;
  const router = useRouter();
  const { user } = useAuth();
  
  // State for feedback form
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [productId, setProductId] = useState('');
  const [isCollectionIssue, setIsCollectionIssue] = useState(false);
  const [isDeliveryIssue, setIsDeliveryIssue] = useState(false);
  const [error, setError] = useState(null);

  // Fetch feedback data from API
  useEffect(() => {
    fetchFeedback();
  }, [xcus, zid]);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomerFeedback(xcus, Number(zid));
      // API returns array or object; adjust accordingly
      setFeedbacks(Array.isArray(data) ? data : data.feedbacks || []);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert('Validation Error', 'Please provide feedback description');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const feedbackData = {
        zid: Number(zid),
        customer_id: xcus,
        product_id: productId.trim(),
        is_delivery_issue: isDeliveryIssue,
        is_collection_issue: isCollectionIssue,
        description: feedbackText,
        user_id: user?.id || user?.employee_id || ''
      };
      
      const created = await createFeedback(feedbackData);
      setFeedbacks(prev => [created, ...prev]);
      setFeedbackText('');
      setProductId('');
      setIsCollectionIssue(false);
      setIsDeliveryIssue(false);
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
          <Text className="text-lg font-semibold text-gray-900">Customer Feedback</Text>
          <Text className="text-sm text-gray-600 mt-0.5" numberOfLines={1}>
            {xorg} (ID: {xcus})
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">{xmobile}</Text>
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
          {/* Action Icons */}

          
          {/* Feedback Form */}
          <View className="bg-white m-4 rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center mb-4">
              <MessageSquare size={18} color="#6b7280" />
              <Text className="text-base font-semibold text-gray-900 ml-2">Add New Feedback</Text>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1.5">Product ID</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900"
                value={productId}
                onChangeText={setProductId}
                placeholder="Enter product ID"
                placeholderTextColor="#9ca3af"
              />
            </View>
            
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
            
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Feedback Description</Text>
              <TextInput 
                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 min-h-[150px] max-h-[300px]"
                placeholder="Enter customer feedback here..."
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
          </View>
          
          {/* Feedback History */}
          <View className="bg-white m-4 mt-0 rounded-xl p-4 shadow-sm">
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-900">Feedback History</Text>
            </View>
            
            {loading ? (
              <ActivityIndicator size="large" color="#3b82f6" className="py-6" />
            ) : feedbacks.length > 0 ? (
              feedbacks.map((feedback, index) => (
                <FeedbackItem key={feedback.id || index} feedback={feedback} />
              ))
            ) : (
              <Text className="text-center text-gray-500 py-6">No feedback history found</Text>
            )}
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}