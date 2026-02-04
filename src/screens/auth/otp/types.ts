export interface OtpVerificationParams {
  email: string;
  shouldResendOtp?: boolean;
}

export interface OtpInputProps {
  length?: number;
  onChangeOtp?: (code: string) => void;
  error?: string;
}

export type OtpInputRef = {
  reset: () => void;
};