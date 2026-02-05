// History Types

export interface TopUpItem {
  topup_history_id: number;
  user_id: number;
  package_id: number;
  subscription_id: number | null;
  currency_symbol: string;
  topup_type: string;
  amount_paid: string;
  amount: string;
  payment_status: string;
  payment_method: string;
  payment_intent?: string;
  transaction_id: string;
  created_at: string;
  updated_at: string;
  credit_journal?: {
    credits_used: number;
    credits_before: number;
    credits_after: number;
    credit_type: string;
  };
  user: {
    user_id: number;
    full_name: string;
    email: string;
  };
  package: {
    package_id: number;
    name: string;
    price: string;
  } | null;
  subscription: {
    subscription_id: number;
    name: string;
    price: number;
  } | null;
}

export interface TopupHistoryListProps {
  onItemPress?: (item: TopUpItem) => void;
}

export interface TopupReceiptModalProps {
  visible: boolean;
  onClose: () => void;
  item: TopUpItem | null;
}

export interface UsageItem {
  usage_history_id: number;
  service_type: string;
  request_data: string;
  response_data: string;
  created_at: string;
  updated_at: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  payment_type: 'direct' | 'credit';
  user: {
    user_id: number;
    full_name: string;
    email: string;
  };
}

export interface UsageHistoryListProps {
  onItemPress?: (item: UsageItem) => void;
}

export interface UsageReceiptItem {
  job_id: string;
  usage_history_id: string;
  created_at: string;
  transaction_id: string;
  item_name: string;
  item_icon?: React.ReactNode;
  points: number;
  previous_points: number;
  points_used: number;
  remaining_points: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  payment_type: 'credit' | 'direct';
  service_type: string;
  response_data: string;
  request_data?: string;
  currency_symbol?: string;
  amount?: string;
  credit_journal?: {
    credits_used: number;
    credits_before: number;
    credits_after: number;
    credit_type: string;
  };
}

export interface UsageReceiptModalProps {
  visible: boolean;
  onClose: () => void;
  item: UsageReceiptItem | null;
}

export type PurchaseHistoryTab = 'history' | 'topup';