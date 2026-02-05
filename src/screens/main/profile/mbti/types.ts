/**
 * Type definitions for MBTI feature
 */

// MBTI profile data structure
export interface MbtiProfile {
  mbti_type: string;
  name: string;
  description: string;
  strengths: string;
  weaknesses: string;
  relationships: string;
  career: string;
  [key: string]: unknown;
}

// API response for MBTI profile
export interface MbtiProfileResponse {
  data: MbtiProfile;
  [key: string]: unknown;
}

// Props for MBTI results screen
export interface MbtiResultsProps {
  navigation: {
    goBack: () => void;
    getState: () => {
      routes: { name: string }[];
    };
    popToTop: () => void;
    replace: (name: string) => void;
  };
}

// Props for MBTI profile component
export interface MbtiProfileComponentProps {
  profile?: MbtiProfile | null;
}