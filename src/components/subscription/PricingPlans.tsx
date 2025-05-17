
import React, { useState } from 'react';
import PricingCard from './PricingCard';
import { useSubscription, SubscriptionPlan } from '@/contexts/SubscriptionContext';
import { toast } from '@/hooks/toast';

const PricingPlans: React.FC = () => {
  const { plans, plansLoading, subscriptionStatus, createCheckoutSession } = useSubscription();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (processingPlanId) return;
    
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
      <div className="flex justify-center py-8 max-w-6xl mx-auto">
        <div className="h-[400px] w-full max-w-md rounded-lg border-2 border-border/30 animate-pulse bg-muted/20" />
      </div>
    );
  }

  // Filtrar para mostrar apenas o plano Pro
  const proPlan = plans.find(plan => plan.name === "Pro");

  if (!proPlan) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Nenhum plano disponível no momento. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8 max-w-6xl mx-auto">
      <div className="w-full max-w-md">
        <PricingCard
          key={proPlan.id}
          plan={proPlan}
          isCurrentPlan={subscriptionStatus.subscription_tier === proPlan.name}
          isRecommended={true}
          onSelectPlan={handleSelectPlan}
          disabled={processingPlanId !== null}
        />
      </div>
    </div>
  );
};

export default PricingPlans;
