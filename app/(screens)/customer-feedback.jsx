import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  ActivityIndicator, 
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
  Text,
  TextInput
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, MessageSquare, Star, User, Calendar, Send, Phone, BarChart } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';

// Sample feedback data - in a real app, this would come from an API or database
const sampleFeedbacks = [
  {
    id: 1,
    customerId: 'C001',
    text: 'Very satisfied with the service. The delivery was prompt and the product quality exceeded expectations.',
    rating: 5,
    date: '2025-04-30',
    agent: 'Ahmed Ali'
  },
  {
    id: 2, 
    customerId: 'C001',
    text: 'The product was good but delivery took longer than expected.',
    rating: 3,
    date: '2025-04-15',
    agent: 'Sara Khan'
  }
];

// Pure React Native Star Rating component
const StarRating = ({ rating, onRatingChange, editable = false }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable 
          key={star} 
          onPress={() => editable && onRatingChange(star)}
          disabled={!editable}
          style={styles.starButton}
        >
          <Star 
            size={20} 
            color={star <= rating ? '#f59e0b' : '#d1d5db'} 
            fill={star <= rating ? '#f59e0b' : 'none'} 
          />
        </Pressable>
      ))}
    </View>
  );
};

// Pure React Native Feedback Item component
const FeedbackItem = ({ feedback }) => {
  return (
    <Animated.View entering={FadeIn.delay(200).duration(400)}>
      <View style={styles.feedbackItem}>
        <View style={styles.feedbackHeader}>
          <StarRating rating={feedback.rating} />
          <Text style={styles.dateText}>{feedback.date}</Text>
        </View>
        
        <Text style={styles.feedbackText}>{feedback.text}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.agentRow}>
          <User size={14} color="#6b7280" />
          <Text style={styles.agentText}>Recorded by: {feedback.agent}</Text>
        </View>
      </View>
    </Animated.View>
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
  const [rating, setRating] = useState(0);

  // Fetch feedback data (using sample data for now)
  useEffect(() => {
    setLoading(true);
    // In a real app, you would fetch feedback data from your API or database
    setTimeout(() => {
      setFeedbacks(sampleFeedbacks);
      setLoading(false);
    }, 1000);
  }, [xcus, zid]);

  // Submit feedback
  const handleSubmitFeedback = () => {
    if (!feedbackText.trim() || rating === 0) return;
    
    setSubmitting(true);
    
    // In a real app, you would submit to your API
    setTimeout(() => {
      const newFeedback = {
        id: Date.now(),
        customerId: xcus,
        text: feedbackText,
        rating: rating,
        date: new Date().toISOString().split('T')[0],
        agent: user?.employee_name || 'Anonymous'
      };
      
      setFeedbacks(prev => [newFeedback, ...prev]);
      setFeedbackText('');
      setRating(0);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Customer Feedback</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {xorg} (ID: {xcus})
          </Text>
          <Text style={styles.phoneNumber}>{xmobile}</Text>
        </View>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <Animated.ScrollView 
          entering={FadeInDown.duration(300)}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Action Icons */}
          <View style={styles.actionIcons}>
            <TouchableOpacity style={styles.actionIconButton}>
              <Phone size={24} color="#4f46e5" />
              <Text style={styles.actionIconText}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionIconButton}>
              <BarChart size={24} color="#8b5cf6" />
              <Text style={styles.actionIconText}>Analysis</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionIconButton}>
              <MessageSquare size={24} color="#0ea5e9" />
              <Text style={styles.actionIconText}>Feedback</Text>
            </TouchableOpacity>
          </View>
          
          {/* Feedback Form */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <MessageSquare size={18} color="#6b7280" />
              <Text style={styles.formTitle}>Add New Feedback</Text>
            </View>
            
            <View style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>Rating:</Text>
              <StarRating 
                rating={rating} 
                onRatingChange={setRating} 
                editable={true} 
              />
            </View>
            
            <View style={styles.textAreaContainer}>
              <TextInput 
                style={styles.textArea}
                placeholder="Enter customer feedback here..."
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline={true}
                numberOfLines={4}
              />
            </View>
            
            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!feedbackText.trim() || rating === 0 || submitting) && styles.disabledButton
              ]}
              onPress={handleSubmitFeedback}
              disabled={!feedbackText.trim() || rating === 0 || submitting}
            >
              {submitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <View style={styles.buttonContent}>
                  <Send color="white" size={18} />
                  <Text style={styles.buttonText}>Submit Feedback</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Feedback History */}
          <View style={styles.historyHeader}>
            <Calendar size={18} color="#6b7280" />
            <Text style={styles.historyTitle}>Feedback History</Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              {[...Array(3)].map((_, index) => (
                <View key={index} style={styles.skeletonItem} />
              ))}
            </View>
          ) : feedbacks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MessageSquare size={40} color="#d1d5db" />
              <Text style={styles.emptyText}>
                No feedback recorded yet
              </Text>
            </View>
          ) : (
            <View>
              {feedbacks.map((item) => (
                <FeedbackItem key={item.id} feedback={item} />
              ))}
            </View>
          )}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionIconButton: {
    alignItems: 'center',
  },
  actionIconText: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 4,
  },
  formCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563',
    marginLeft: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#4b5563',
    marginRight: 8,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    marginHorizontal: 2,
  },
  textAreaContainer: {
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#8b5cf6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563',
    marginLeft: 8,
  },
  loadingContainer: {
    marginTop: 8,
  },
  skeletonItem: {
    height: 96,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 12,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 8,
    color: '#9ca3af',
    textAlign: 'center',
  },
  feedbackItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
  },
  feedbackText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 8,
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
  },
});