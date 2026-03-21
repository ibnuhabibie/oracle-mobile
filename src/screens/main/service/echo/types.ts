/**
 * Type definitions for Echo/Secret Diary feature
 */

// Message conversation type
export type ConversationType = 'user' | 'ai';

// Message interface
export interface Message {
  conversation_id: string;
  type: ConversationType;
  content: string;
  created_at?: string;
}

// Chat area props
export interface ChatAreaProps {
  messages: Message[];
  lastMessage: Message | null;
  setModalVisible: (visible: boolean) => void;
}

// User profile for initials
export interface UserProfile {
  full_name?: string;
  [key: string]: unknown;
}

// Diary entry
export interface Diary {
  diary_id: string;
  diary_date: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

// API response for diaries list
export interface DiariesResponse {
  data: Diary[];
  [key: string]: unknown;
}

// Secret diary detail response
export interface SecretDiaryResponse {
  diary_id: string;
  diary_date: string;
  content: string;
  conversations: Message[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

// Marked dates for calendar
export interface MarkedDates {
  [dateString: string]: {
    marked: boolean;
    dotColor: string;
    diaryId?: string;
  };
}

// Date data type from react-native-calendars
export interface DateData {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp?: number;
}

// Month data for calendar
export interface MonthData {
  dateString: string;
  day: number;
  month: number;
  year: number;
}

// Month range for API
export interface MonthRange {
  start_date: string;
  end_date: string;
}

// Floating footer props
export interface FloatingFooterProps {
  onSend: (message: string) => void;
  t: (key: string, params?: Record<string, unknown>) => string;
}

// Floating add button props
export interface FloatingAddButtonProps {
  onPress: () => void;
}