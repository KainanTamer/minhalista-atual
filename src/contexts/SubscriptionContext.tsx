
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/toast';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  stripe_price_id: string;
  features: string[];
}

interface SubscriptionLimits {
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

interface SubscriptionContextProps {
  plans: SubscriptionPlan[];
  plansLoading: boolean;
  subscriptionStatus: SubscriptionStatus;
  refreshSubscriptionStatus: () => Promise<void>;
  createCheckoutSession: (priceId: string) => Promise<string | null>;
  openCustomerPortal: () => Promise<string | null>;
  checkLimit: (type: 'events' | 'finances' | 'repertoire' | 'networking', currentCount: number) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    loading: true,
    error: null,
    limits: {
      events: 5,
      finances: 5,
      repertoire: 5,
      networking: 5,
      showAds: true
    }
  });

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });

      if (error) {
        console.error('Erro ao buscar planos:', error);
        return;
      }

      const formattedPlans = data.map(plan => ({
        ...plan,
        features: Array.isArray(plan.features) 
          ? plan.features.map(f => String(f)) 
          : typeof plan.features === 'object' 
            ? Object.values(plan.features).map(f => String(f)) 
            : []
      }));

      setPlans(formattedPlans as SubscriptionPlan[]);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
    } finally {
      setPlansLoading(false);
    }
  };

  const refreshSubscriptionStatus = async () => {
    if (!user) {
      setSubscriptionStatus({
        subscribed: false,
        subscription_tier: "Básico",
        subscription_end: null,
        loading: false,
        error: null,
        limits: {
          events: 5,
          finances: 5,
          repertoire: 5,
          networking: 5,
          showAds: true
        }
      });
      return;
    }

    setSubscriptionStatus(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        method: 'POST',
        body: {}
      });

      if (error) throw new Error(error.message);

      setSubscriptionStatus({
        subscribed: data.subscribed,
        subscription_tier: data.subscription_tier,
        subscription_end: data.subscription_end,
        loading: false,
        error: null,
        limits: data.limits || {
          events: 5,
          finances: 5,
          repertoire: 5,
          networking: 5,
          showAds: true
        }
      });
    } catch (error) {
      console.error('Erro ao verificar status da assinatura:', error);
      setSubscriptionStatus(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao verificar status da assinatura'
      }));
    }
  };

  const createCheckoutSession = async (priceId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        method: 'POST',
        body: { priceId }
      });

      if (error) {
        toast({
          title: 'Erro ao iniciar checkout',
          description: error.message,
          variant: 'destructive'
        });
        return null;
      }

      return data.url;
    } catch (error) {
      toast({
        title: 'Erro ao iniciar checkout',
        description: error.message || 'Ocorreu um erro ao processar sua solicitação',
        variant: 'destructive'
      });
      return null;
    }
  };

  const openCustomerPortal = async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        method: 'POST',
        body: {}
      });

      if (error) {
        toast({
          title: 'Erro ao abrir portal de gerenciamento',
          description: error.message,
          variant: 'destructive'
        });
        return null;
      }

      return data.url;
    } catch (error) {
      toast({
        title: 'Erro ao abrir portal de gerenciamento',
        description: error.message || 'Ocorreu um erro ao processar sua solicitação',
        variant: 'destructive'
      });
      return null;
    }
  };
  
  // Função para verificar se o usuário atingiu o limite para determinado recurso
  const checkLimit = (type: 'events' | 'finances' | 'repertoire' | 'networking', currentCount: number): boolean => {
    const limit = subscriptionStatus.limits[type];
    
    // Se o limite for -1, significa que é ilimitado
    if (limit === -1) {
      return true;
    }
    
    // Se o limite for um número positivo, verificar se o usuário já atingiu o limite
    return currentCount < limit;
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (user) {
      refreshSubscriptionStatus();
    }
  }, [user]);

  const value = {
    plans,
    plansLoading,
    subscriptionStatus,
    refreshSubscriptionStatus,
    createCheckoutSession,
    openCustomerPortal,
    checkLimit
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
