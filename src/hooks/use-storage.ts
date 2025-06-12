
// Async storage hooks for managing auth token and user profile
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_PROFILE: 'user_profile'
} as const;

export const useAsyncStorage = () => {
    const setAuthToken = async (token: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        } catch (error) {
            console.error('Error saving auth token:', error);
        }
    };

    const getAuthToken = async (): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    };

    const removeAuthToken = async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        } catch (error) {
            console.error('Error removing auth token:', error);
        }
    };

    const setUserProfile = async (profile: object): Promise<void> => {
        try {
            const jsonValue = JSON.stringify(profile);
            await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, jsonValue);
        } catch (error) {
            console.error('Error saving user profile:', error);
        }
    };

    const getUserProfile = async (): Promise<object | null> => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    };

    const removeUserProfile = async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
        } catch (error) {
            console.error('Error removing user profile:', error);
        }
    };

    const clearStorage = async (): Promise<void> => {
        try {
            await AsyncStorage.multiRemove([
                STORAGE_KEYS.AUTH_TOKEN,
                STORAGE_KEYS.USER_PROFILE
            ]);
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    };

    return {
        setAuthToken,
        getAuthToken,
        removeAuthToken,
        setUserProfile,
        getUserProfile,
        removeUserProfile,
        clearStorage
    };
};