
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/toast';
import { SubscriptionStatus } from './types';
import { getDefaultLimits, getPlanLimits } from './subscriptionUtils';

export function useSubscriptionApi() {
  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });

      if (error) {
        console.error('Erro ao buscar planos:', error);
        return [];
      }

      return data.map(plan => ({
        ...plan,
        features: Array.isArray(plan.features) 
          ? plan.features.map(f => String(f)) 
          : typeof plan.features === 'object' 
            ? Object.values(plan.features).map(f => String(f)) 
            : []
      }));
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      return [];
    }
  };

  const fetchSubscriptionStatus = async (userId: string | undefined) => {
    if (!userId) {
      return {
        subscribed: false,
        subscription_tier: "Básico", // Sempre definido como Básico por padrão
        subscription_end: null,
        loading: false,
        error: null,
        limits: getDefaultLimits()
      } as SubscriptionStatus;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        method: 'POST',
        body: {}
      });

      if (error) throw new Error(error.message);
      
      // Se não houver plano definido ou for diferente de Pro, use Básico como padrão
      const tier = data.subscribed && data.subscription_tier === "Pro" ? "Pro" : "Básico";
      
      // Use the subscription tier to determine limits
      const limits = getPlanLimits(tier);

      return {
        subscribed: data.subscribed,
        subscription_tier: tier,
        subscription_end: data.subscription_end,
        loading: false,
        error: null,
        limits
      } as SubscriptionStatus;
    } catch (error) {
      console.error('Erro ao verificar status da assinatura:', error);
      throw error;
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

  return {
    fetchPlans,
    fetchSubscriptionStatus,
    createCheckoutSession,
    openCustomerPortal
  };
}
