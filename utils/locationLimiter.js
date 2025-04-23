import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const LOCATION_REQUESTS_KEY = 'location_requests_count';
const LOCATION_REQUESTS_DATE_KEY = 'location_requests_date';
const MAX_DAILY_REQUESTS = 6;

/**
 * Check if a new day has started compared to the stored date
 * @param {string} storedDate - The date stored in AsyncStorage
 * @returns {boolean} True if it's a new day
 */
const isNewDay = (storedDate) => {
  if (!storedDate) return true;
  
  const stored = new Date(storedDate);
  const now = new Date();
  
  return (
    stored.getFullYear() !== now.getFullYear() ||
    stored.getMonth() !== now.getMonth() ||
    stored.getDate() !== now.getDate()
  );
};

/**
 * Get the current request count and remaining requests for the day
 * @returns {Promise<{count: number, remaining: number, resetTime: string}>} Object with count, remaining requests and reset time
 */
export const getLocationRequestsInfo = async () => {
  try {
    const storedCountStr = await AsyncStorage.getItem(LOCATION_REQUESTS_KEY);
    const storedDate = await AsyncStorage.getItem(LOCATION_REQUESTS_DATE_KEY);
    
    // Check if it's a new day
    if (isNewDay(storedDate)) {
      // Reset counter for new day
      await AsyncStorage.setItem(LOCATION_REQUESTS_KEY, '0');
      await AsyncStorage.setItem(LOCATION_REQUESTS_DATE_KEY, new Date().toISOString());
      return { count: 0, remaining: MAX_DAILY_REQUESTS, resetTime: getResetTimeDisplay() };
    }
    
    const count = storedCountStr ? parseInt(storedCountStr) : 0;
    return { 
      count, 
      remaining: Math.max(0, MAX_DAILY_REQUESTS - count),
      resetTime: getResetTimeDisplay()
    };
  } catch (error) {
    console.error('Error getting location request info:', error);
    return { count: 0, remaining: MAX_DAILY_REQUESTS, resetTime: getResetTimeDisplay() };
  }
};

/**
 * Increment the location request count
 * @returns {Promise<{success: boolean, remaining: number}>} Result with success status and remaining requests
 */
export const incrementLocationRequest = async () => {
  try {
    const { count, remaining } = await getLocationRequestsInfo();
    
    // Check if limit reached
    if (remaining <= 0) {
      return { success: false, remaining: 0, resetTime: getResetTimeDisplay() };
    }
    
    // Increment counter
    const newCount = count + 1;
    await AsyncStorage.setItem(LOCATION_REQUESTS_KEY, newCount.toString());
    
    // Ensure date is set
    await AsyncStorage.setItem(LOCATION_REQUESTS_DATE_KEY, new Date().toISOString());
    
    return { 
      success: true, 
      remaining: Math.max(0, MAX_DAILY_REQUESTS - newCount),
      resetTime: getResetTimeDisplay()
    };
  } catch (error) {
    console.error('Error incrementing location request count:', error);
    return { success: false, remaining: 0, resetTime: getResetTimeDisplay() };
  }
};

/**
 * Get a display string for when the counter will reset
 * @returns {string} Time until reset
 */
const getResetTimeDisplay = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  // Time until midnight
  const hoursUntilReset = Math.floor((tomorrow - now) / (1000 * 60 * 60));
  const minutesUntilReset = Math.floor(((tomorrow - now) % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hoursUntilReset}h ${minutesUntilReset}m`;
};