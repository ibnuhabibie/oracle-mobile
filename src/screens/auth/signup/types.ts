export interface RegisterDTO {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  referral_code?: string;
  locale?: string;
}

export interface AuthFormProps {
  onSuccess: (data: any) => void;
}