export interface LoginDTO {
  email: string;
  password: string;
  fcm_token?: string;
  locale?: string;
  additional_info?: any;
}

export interface AuthFormProps {
  onSuccess: (user: any) => void;
}