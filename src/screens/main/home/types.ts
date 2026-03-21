import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ScaledSize } from 'react-native';

import type { MainNavigatorParamList } from '../../../navigators/types';

/**
 * Props for the Home screen component
 */
export type HomeProps = NativeStackScreenProps<MainNavigatorParamList, 'Home'>;

/**
 * Carousel item configuration
 * Each item represents a service/feature accessible from the home screen
 */
export type CarouselItem = {
  /** Unique identifier for the carousel item */
  id: 'love' | 'fortune' | 'relation' | 'myReport' | 'baziReport' | 'astroReport' | 'mbtiReport';
  /** Display title for the carousel card */
  title: string;
  /** Subtitle text for the carousel card */
  subtitle: string;
  /** Navigation route to navigate to when item is pressed */
  path: keyof MainNavigatorParamList;
};

/**
 * Window dimensions configuration
 * Used for responsive layout in the carousel
 */
export type WindowDimensions = ScaledSize;

/**
 * User profile information
 */
export interface UserProfile {
  full_name?: string;
  [key: string]: any;
}

/**
 * Daily profile data containing today's metrics and description
 */
export interface DailyProfileData {
  today_description?: string;
  today_points?: number;
  today_wealth_points?: number;
  today_study_points?: number;
  today_relationship_points?: number;
  today_career_points?: number;
  [key: string]: any;
}

/**
 * Props for LocalizedHeader component
 */
export interface LocalizedHeaderProps {
  user?: UserProfile | null;
}

/**
 * Service card data structure
 * Represents a service item displayed in the carousel
 */
export type ServiceCardData = {
  /** Unique identifier for the service card */
  id: 'love' | 'fortune' | 'relation' | 'myReport' | 'baziReport' | 'astroReport' | 'mbtiReport';
  /** Display title for the card */
  title: string;
  /** Subtitle text for the card */
  subtitle: string;
  /** Navigation route path */
  path: string;
};

/**
 * Props for ServiceCard component
 */
export interface ServiceCardProps {
  /** Card data containing id, title, subtitle, and path */
  data: ServiceCardData;
  /** Navigation object for routing */
  navigation: any;
  /** Optional navigation data to pass to destination routes */
  navigationData?: any;
}
