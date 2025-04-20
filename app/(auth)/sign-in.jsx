import React, { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { ButtonText, ButtonIcon, ButtonSpinner } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { FormControl } from '@/components/ui/form-control';
import { FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon, LogInIcon } from 'lucide-react-native';
import { Alert, AlertText, AlertIcon } from '@/components/ui/alert';
import { InfoIcon } from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const { login } = useAuth();

  // Load saved credentials when component mounts
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('savedUsername');
        const savedPassword = await AsyncStorage.getItem('savedPassword');
        const savedRememberMe = await AsyncStorage.getItem('rememberMe');
        
        if (savedUsername) setUsername(savedUsername);
        if (savedPassword) setPassword(savedPassword);
        if (savedRememberMe !== null) setRememberMe(savedRememberMe === 'true');
      } catch (error) {
        console.error('Error loading saved credentials:', error);
      }
    };
    
    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      
      // Additional logging to help diagnose issues
      console.log(`Login attempt: ${username} in ${__DEV__ ? 'development' : 'production'} mode`);
      
      await login(username, password);
      
      // Save credentials if remember me is checked
      if (rememberMe) {
        await AsyncStorage.setItem('savedUsername', username);
        await AsyncStorage.setItem('savedPassword', password);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        // Clear saved credentials if remember me is unchecked
        await AsyncStorage.removeItem('savedUsername');
        await AsyncStorage.removeItem('savedPassword');
        await AsyncStorage.setItem('rememberMe', 'false');
      }
    } catch (err) {
      console.error('Login error details:', err);
      
      // Handle different error types
      if (err.message?.includes('Network Error')) {
        setError('Cannot connect to server. Please check your internet connection and verify the server is accessible.');
      } else if (err.response?.data?.detail && Array.isArray(err.response.data.detail)) {
        setError(err.response.data.detail.map(e => e.msg).join(', '));
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = username.length > 0 && password.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom', 'left', 'right']}>
      <Center className="flex-1 px-4">
        <Box className="w-full max-w-[400px]">
          <VStack space="md">
            <Center className="mb-6">
              <Heading size="2xl" className="text-primary">
                Welcome Back
              </Heading>
              <Text size="sm" className="text-gray-400">
                Please sign in to your account
              </Text>
            </Center>

            {error && (
              <Alert action="error" variant="solid" mb="$3">
                <AlertIcon as={InfoIcon} />
                <AlertText>{error}</AlertText>
              </Alert>
            )}

            <FormControl className="mb-4">
              <FormControlLabel>
                <FormControlLabelText className="text-gray-400">Username</FormControlLabelText>
              </FormControlLabel>
              <Input
                variant="outline"
                size="xl"
              >
                <InputField
                  placeholder="Enter your username"
                  value={username}
                  onChangeText={setUsername}
                  className="text-primary-400"
                  placeholderTextColor="gray-100"
                />
              </Input>
            </FormControl>

            <FormControl className="mb-6">
              <FormControlLabel>
                <FormControlLabelText className="text-gray-400">Password</FormControlLabelText>
              </FormControlLabel>
              <Input size="xl">
                <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  className="text-primary-500"
                  placeholderTextColor={"#0000"}
                />
                <InputSlot 
                  onPress={() => setShowPassword(!showPassword)}
                  className="pr-3"
                >
                  <InputIcon 
                    as={showPassword ? EyeOffIcon : EyeIcon} 
                    className="text-gray-500"
                  />
                </InputSlot>
              </Input>
            </FormControl>

            {/* Remember Me checkbox with improved styling */}
            <Box className="mb-6">
              <HStack space="sm" alignItems="center">
                <Checkbox
                  value="rememberMe"
                  isChecked={rememberMe}
                  onChange={setRememberMe}
                  aria-label="Remember me"
                  accessibilityLabel="Remember me"
                >
                  <CheckIcon color="$primary500" />
                </Checkbox>
                <Text size="sm" className="text-gray-500 ml-2">Remember Me</Text>
              </HStack>
            </Box>

            <Button
              size="lg"
              variant="solid"
              action="primary"
              isDisabled={!isFormValid || isLoading}
              onPress={handleLogin}
              className="mb-6 bg-primary-800 disabled:bg-gray-700"
            >
              {isLoading ? (
                <ButtonSpinner className="mr-2" />
              ) : (
                <ButtonIcon as={LogInIcon} className="mr-2" />
              )}
              <ButtonText>
                {isLoading ? "Signing In..." : "Sign In"}
              </ButtonText>
            </Button>

            <Center className="mt-6">
              <Text className="text-gray-400">
                Don't have an account?{' '}
                
                  <Text className="text-info-600 font-bold">
                    Ask Your Admin to Create One
                  </Text>
                
              </Text>
            </Center>

            <Center className="mt-4">
              <Link href="../(auth)/forgot-password" asChild>
                <Text className="text-gray-400 underline">
                  Forgot Password?
                </Text>
              </Link>
            </Center>
          </VStack>
        </Box>
      </Center>
    </SafeAreaView>
  );
};

export default SignIn;