
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionApi } from './useSubscriptionApi';
import { checkLimit, getDefaultLimits } from './subscriptionUtils';
import { 
  SubscriptionPlan, 
  SubscriptionStatus, 
  SubscriptionContextProps 
} from './types';

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { 
    fetchPlans, 
    fetchSubscriptionStatus, 
    createCheckoutSession: apiCreateCheckout, 
    openCustomerPortal: apiOpenPortal 
  } = useSubscriptionApi();
  
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    subscription_tier: "Básico", // Sempre definido como Básico por padrão
    subscription_end: null,
    loading: true,
    error: null,
    limits: getDefaultLimits()
  });

  const loadPlans = async () => {
    try {
      const plansData = await fetchPlans();
      setPlans(plansData as SubscriptionPlan[]);
    } finally {
      setPlansLoading(false);
    }
  };

  const refreshSubscriptionStatus = async () => {
    setSubscriptionStatus(prev => ({ ...prev, loading: true, error: null }));

    try {
      const status = await fetchSubscriptionStatus(user?.id);
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Erro ao verificar status da assinatura:', error);
      setSubscriptionStatus(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao verificar status da assinatura'
      }));
    }
  };

  const checkLimitHandler = (
    type: 'events' | 'finances' | 'repertoire' | 'networking', 
    currentCount: number
  ): boolean => {
    return checkLimit(type, currentCount, subscriptionStatus.limits);
  };
  
  const createCheckoutSession = async (priceId: string): Promise<string | null> => {
    return apiCreateCheckout(priceId);
  };

  const openCustomerPortal = async (): Promise<string | null> => {
    return apiOpenPortal();
  };

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    if (user) {
      refreshSubscriptionStatus();
    } else {
      setSubscriptionStatus({
        subscribed: false,
        subscription_tier: "Básico", // Sempre definido como Básico por padrão
        subscription_end: null,
        loading: false,
        error: null,
        limits: getDefaultLimits()
      });
    }
  }, [user]);

  const value = {
    plans,
    plansLoading,
    subscriptionStatus,
    refreshSubscriptionStatus,
    createCheckoutSession,
    openCustomerPortal,
    checkLimit: checkLimitHandler
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription deve ser usado dentro de um SubscriptionProvider');
  }
  return context;
};
