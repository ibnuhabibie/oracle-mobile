/**
 * Type definitions for Topup feature
 */

// Translation item structure
export interface TranslationItem {
  key: string;
  value: string;
  locale: string;
  [key: string]: unknown;
}

// Pricing variant data structure
export interface PricingVariantItem {
  pricing_variant_id: number;
  locale: string;
  currency_symbol: string;
  price: string;
  stripe_price_id: string;
  [key: string]: unknown;
}

// Subscription data structure
export interface SubscriptionItem {
  subscription_id: number;
  name: string;
  description: string;
  price: string;
  duration_months: number;
  credits: number;
  rc_package_id: string;
  is_active: boolean;
  translations?: TranslationItem[];
  pricing_variants?: PricingVariantItem[];
  [key: string]: unknown;
}

// Props for SubscriptionCardList component
export interface SubscriptionCardListProps {
  subscriptions: SubscriptionItem[];
  selectedSubscription: SubscriptionItem | null;
  setSelectedSubscription: (sub: SubscriptionItem) => void;
  loading: boolean;
  error: string | null;
  locale: string;
}

// Props for SubscriptionCard component
export interface SubscriptionCardProps {
  subscription: SubscriptionItem;
  onPress: (() => void) | null;
  locale: string;
  selectedSubscription: SubscriptionItem | null;
}

// Props for ActiveSubscription component
export interface ActiveSubscriptionProps {
  subscription: SubscriptionItem;
  locale: string;
  loading: boolean;
}

// Props for Topup screen
export interface TopupScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: unknown) => void;
  };
}

// Props for Coin component
export interface CoinProps {
  type?: 'silver' | 'gold';
}

// Props for RadioIndicator component
export interface RadioIndicatorProps {
  selected: boolean;
}