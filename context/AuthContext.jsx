import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/lib/api_users';
import { useSegments, useRouter } from 'expo-router';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userInfo = await checkUser();
        if (userInfo) setUser(userInfo);
      } catch (error) {
        console.error('Initial auth check failed:', error);
        // Try offline login if online check fails
        const offlineUserData = await AsyncStorage.getItem('offlineUserData');
        if (offlineUserData) {
          try {
            setIsOffline(true);
            setUser(JSON.parse(offlineUserData));
            console.log('Using offline user data');
          } catch (e) {
            console.error('Failed to parse offline user data:', e);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user && segments[0] !== '(auth)') {
      router.replace('/sign-in');
    }
  }, [user, loading]);

  const checkUser = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('No tokens available');
      
      try {
        // Try to get user from API
        const userInfo = await getCurrentUser();
        // Store user data for offline use
        await AsyncStorage.setItem('offlineUserData', JSON.stringify(userInfo));
        setIsOffline(false);
        return userInfo;
      } catch (apiError) {
        console.error('API request failed:', apiError);
        // If API request fails, try to use offline data
        const offlineUserData = await AsyncStorage.getItem('offlineUserData');
        if (offlineUserData) {
          setIsOffline(true);
          return JSON.parse(offlineUserData);
        }
        throw apiError;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Only clear tokens if we're online and the error is authentication-related
      if (!isOffline) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      }
      return null;
    }
  };

  const login = async (username, password) => {
    try {
      // First try online login
      const { access_token, refresh_token } = await apiLogin(username, password);
      await AsyncStorage.multiSet([
        ['accessToken', access_token],
        ['refreshToken', refresh_token],
        ['offlineUsername', username],
        ['offlinePassword', password]
      ]);

      const userInfo = await getCurrentUser();
      // Store user data for offline use
      await AsyncStorage.setItem('offlineUserData', JSON.stringify(userInfo));
      setIsOffline(false);
      setUser(userInfo);
      router.replace('/(tabs)/home');
      return true;
    } catch (error) {
      console.error('Online login failed:', error?.response?.data || error.message);
      
      // If error is network-related, try offline login
      if (error?.message?.includes('Network Error')) {
        console.log('Attempting offline login...');
        const offlineUsername = await AsyncStorage.getItem('offlineUsername');
        const offlinePassword = await AsyncStorage.getItem('offlinePassword');
        const offlineUserData = await AsyncStorage.getItem('offlineUserData');
        
        if (offlineUsername === username && 
            offlinePassword === password && 
            offlineUserData) {
          // Offline login succeeded
          setIsOffline(true);
          setUser(JSON.parse(offlineUserData));
          router.replace('/(tabs)/home');
          return true;
        }
      }
      
      // If we get here, both online and offline login failed
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!isOffline) {
        await apiLogout();
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      // Keep offline credentials to allow future offline login
      setUser(null);
      router.replace('/sign-in');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isOffline }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
