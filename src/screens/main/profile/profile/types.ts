/**
 * Type definitions for Profile feature
 */

// City data structure from API
export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  [key: string]: unknown;
}

// Country data structure from API
export interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3?: string;
  [key: string]: unknown;
}

// User profile data from API/storage
export interface UserProfile {
  full_name: string;
  email: string;
  mobile_phone: string;
  birth_date: string;
  birth_time: string;
  gender: 'Male' | 'Female';
  birth_country: string;
  birth_city: string;
  birth_lat: string | number;
  birth_lng: string | number;
  locale: string;
  mbti_profile?: string;
  referral_code?: string;
  gold_credits?: number;
  silver_credits?: number;
  subscription_id?: number | null;
  [key: string]: unknown;
}

// Form data structure for profile editing
export interface ProfileFormData {
  full_name: string;
  email: string;
  mobile_phone: string;
  birth_date: Date;
  birth_time: Date;
  gender: 'Male' | 'Female';
  birth_country: Country | null;
  birth_city: City | null;
  language: string;
}

// Props for ProfileForm component
export interface ProfileFormProps {
  onSubmit: (data: ProfileFormData) => void;
}

// Props for Profile screen
export interface ProfileScreenProps {
  navigation: {
    navigate: (screen: string, params?: unknown) => void;
  };
}

// Form validation rules type
export interface FormRules {
  [fieldName: string]: {
    required?: string;
    minLength?: {
      value: number;
      message: string;
    };
    pattern?: {
      value: RegExp;
      message: string;
    };
  };
}