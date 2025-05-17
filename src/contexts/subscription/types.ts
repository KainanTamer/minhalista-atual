
import { User } from "@supabase/supabase-js";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  stripe_price_id: string;
  features: string[];
}

export interface SubscriptionLimits {
  events: number;
  finances: number;
  repertoire: number;
  networking: number;
  showAds: boolean;
}

export interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  loading: boolean;
  error: string | null;
  limits: SubscriptionLimits;
}

export interface SubscriptionContextProps {
  plans: SubscriptionPlan[];
  plansLoading: boolean;
  subscriptionStatus: SubscriptionStatus;
  refreshSubscriptionStatus: () => Promise<void>;
  createCheckoutSession: (priceId: string) => Promise<string | null>;
  openCustomerPortal: () => Promise<string | null>;
  checkLimit: (type: 'events' | 'finances' | 'repertoire' | 'networking', currentCount: number) => boolean;
}
