
import React, { useState } from 'react';
import PricingCard from './PricingCard';
import { useSubscription, SubscriptionPlan } from '@/contexts/SubscriptionContext';
import { toast } from '@/hooks/toast';

const PricingPlans: React.FC = () => {
  const { plans, plansLoading, subscriptionStatus, createCheckoutSession } = useSubscription();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (processingPlanId) return;
    
    // Se o plano for gratuito (Básico), exiba uma mensagem e não faça checkout
    if (plan.price === 0) {
      toast({
        title: 'Plano Básico',
        description: 'Você já está usando o plano básico gratuito com limitações.'
      });
      return;
    }
    
    try {
      setProcessingPlanId(plan.id);
      
      const checkoutUrl = await createCheckoutSession(plan.stripe_price_id);
      
      if (checkoutUrl) {
        // Abrir a sessão de checkout do Stripe em uma nova aba
        window.open(checkoutUrl, '_blank');
        
        // Informar o usuário sobre o processo
        toast({
          title: 'Checkout em andamento',
          description: 'Completando o checkout na nova aba. Você será redirecionado após o pagamento.'
        });
      }
    } catch (error) {
      console.error('Erro ao processar plano:', error);
      toast({
        title: 'Erro ao processar plano',
        description: 'Não foi possível iniciar o processo de checkout. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setProcessingPlanId(null);
    }
  };

  if (plansLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 max-w-6xl mx-auto">
        {[...Array(2)].map((_, i) => (
          <div 
            key={i}
            className="h-[400px] rounded-lg border-2 border-border/30 animate-pulse bg-muted/20"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          isCurrentPlan={subscriptionStatus.subscription_tier === plan.name}
          isRecommended={plan.name === "Pro"}
          onSelectPlan={handleSelectPlan}
          disabled={processingPlanId !== null}
        />
      ))}
    </div>
  );
};

export default PricingPlans;
